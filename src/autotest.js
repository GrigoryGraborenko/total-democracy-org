
const fs = require('fs');
const crypto = require('crypto');
const Sequelize = require('sequelize');

const puppeteer = require('puppeteer');

import { GetTime } from './utils';

////////////////////////////////////////////////////////////////////////////////
async function CreateConnection(db_name, db_config) {

    var sequelize = new Sequelize(db_name, db_config.username, db_config.password, {
        host: db_config.host
        ,dialect: db_config.type
        ,pool: { idle: 20000 }
        ,define: {
            createdAt: 'created_at'
            ,updatedAt: 'updated_at'
        }
    });

    var db = {};
    fs.readdirSync("./db").forEach(function(file) {
        var model = sequelize.import("../src/db/" + file);
        db[model.name] = model;
    });

    Object.keys(db).reduce(function(acc, modelName) {
        var model = db[modelName];
        if("associate" in model) {
            return acc.concat([model]);
        }
        return acc;
    }, []).forEach(function(model) {
        model.associate.apply(model, [db]);
    });

}

////////////////////////////////////////////////////////////////////////////////
async function LoadFixtures(db, fixtures) {

    // password is 'password'
    var cache = {
        password: "3d1573c7b86f4aac3d4cd0b987af0f0f5392dd4aef1bdbdc8d3bde62e2a709b056e75300b769fbced170d7e173b3df1ab5a483686adcde4f69b5df261e046edefd5950909f6fb292fecc43f4fafa334bd2167929d7292fde76b6994760e8c65c30295a0bbcf2b0739786b6d695bdc8514a64da07e236755255cb0ecba4208d25dcf629e5ba7fd8778e24a40cc633a652b7c1c265036d02e6933bac4f41cb830ffe84e4006ab8e80a9990ee180c2ef8740ed9b616c42a50e51efdc948ca4b22dc591bc687270a0ff3ef363af67eb80f65c656e49ed3a778f011af853271ec13878904b69fbd94cdc551b2286811fa15048a58ca65b594671e479450a1867d39dbe9752c5c059ec8d4934bed709eceea631c4be5b805cad597adc0882a93d16eb2522e6da4dbd2514e49aa5a8f025d8ba010bff17aeb27f30afec5dec489d54eee55ece48447eb94341cbbfc24db3c91d8a4c56df5cdd3d8460ba3e8de4e5f773ffcc084151400a7318427c9b78d35b64f3b0480871654c7763f9c617f996fc1b179b05f1ed3d7f7969b50851761fdefb1870bec211ff3b66ff52269dbfe0ce72ca864261e82fa64ac9d67e35e7f81d0d4bca39085af75c121de08058d7627c9483f3072dce4a598c60ba0bebf7a158048ac1799ddda6a98577511e2b7065b1dc30c280ea4bb71367eb8268f4cee66b1db2b18d2884d15691a6418dcd238008400"
        ,salt: "2454105b48bc121594384a3c42b87ac451a787e3408cd4347a2a476a2066efab1c4d493385b2f7dfb7a8d7c4700143951af41858f07fde2276ea7c8022fc6c314a0b808adfc49f5e17e0d16b88999f9afd6cf2107e2700198e914843e23dc4c6b218b4e669c900eb814ab0a114985be8409e36f948ecf8642eb4c4ee2c8f2b0f2d8e427f03e79c5ac662fb6ef44bc8921a3a3ff9e3500526326ef3a5872c1cf49c3a2545df12107205678e946bd92f4dddebd7595ac3e86466b1409451ddc46f1f959d8a38add1b9adf0e049576c05ded966b615ef389cd2cead2bcd76d62e6fc9e75e48b240a03504af1c5e373c9562fad02c4ec47973ddfdb5686d1adf27f9"
        ,session_admin: "admin_session_token"
        ,session_client: "client_session_token"
    };
    for(let f = 0; f < fixtures.fixtures.length; f++) {

        let fixture = fixtures.fixtures[f];

        if(Array.isArray(fixture.objects)) {
            for(let i = 0; i < fixture.objects.length; i++) {
                let obj_spec = fixture.objects[i];
                let obj = Object.assign({}, obj_spec);
                for(let key in obj_spec) {
                    if(cache[obj_spec[key]] !== undefined) {
                        obj[key] = cache[obj_spec[key]];
                    }
                }
                await db[fixture.table].create(obj);
            }
            continue;
        }
        for(let id in fixture.objects) {
            let obj_spec = fixture.objects[id];
            let obj = Object.assign({}, obj_spec);
            for(let key in obj_spec) {
                if(cache[obj_spec[key]] !== undefined) {
                    obj[key] = cache[obj_spec[key]];
                }
            }
            cache[id] = (await db[fixture.table].create(obj)).id;
        }
    }
    return cache;
}

////////////////////////////////////////////////////////////////////////////////
export async function RunTests(dev_sequelize, logger, InitDB, InitServer) {

    logger.info("Initializing tests...");

    var db_query = await dev_sequelize.query("SELECT datname FROM pg_database;");
    var database_names = db_query[0].map(function(item) { return item.datname; });

    const db_prefix = "total_democracy_test_db_";
    const db_usage = db_prefix + "usage";
    const clean_db = false;

    var fixtures_data = fs.readFileSync("./src/test_fixtures.json");
    var fixtures = JSON.parse(fixtures_data + "");

    let test_sets = {};
    fs.readdirSync("./src/tests").forEach(function(file) {
        test_sets[file.replace(".js", "")] = require(`./tests/${file}`);
    });

    /// TODO: reset query needs to hit all tables due to testing creating other items
    var delete_tables = fixtures.fixtures.reduce(function(accum, fixture) {
        var result = accum.slice(0);
        var name = fixture.table_name ? fixture.table_name : fixture.table;
        if(accum.indexOf(name) === -1) {
            result.unshift(name);
        }
        return result;
    }, []);
    var reset_query = delete_tables.map(function(table) {
        return `DELETE FROM ${table};`;
    }).join("");

    if(clean_db && (database_names.indexOf(db_usage) !== -1)) {
        await dev_sequelize.query(`DROP DATABASE ${db_usage};`);
    }
    if(clean_db || (database_names.indexOf(db_usage) === -1)) {
        await dev_sequelize.query(`CREATE DATABASE ${db_usage};`);
    }

    var [sequelize, db] = InitDB(db_usage);
    await sequelize.sync({ force: true});

    //var table_query = await sequelize.query("select table_name from information_schema.tables where table_schema = 'public';");
    //var table_names = table_query[0].map(function(item) { return item.table_name; });

    //await sequelize.query(reset_query);
    //await LoadFixtures(db, fixtures);

    var config = JSON.parse(fs.readFileSync("./config/test.json") + "");
    var port = config.server.port;
    var root_url = `${ config.server.ssl.enable ? "https" : "http" }://localhost:${ port }`;

    var server_logger = {
        trace: function() {}
        ,debug: function() {}
        ,info: function() {}
        ,error: function() {}
    };
    var servers = InitServer(sequelize, db, config, server_logger);
    logger.info("Running tests...");

    var has_only = Object.values(test_sets).some(function(tests) { return tests.some(function(test) { return test.only; }); });

    var total_fixtures_time = 0;
    var total_test_time = 0;
    //var total_browser_time = 0;
    var total_full_time = 0;
    var num_tests_run = 0;
    for(let test_set_name in test_sets) {
        let test_set = test_sets[test_set_name];
        for(let t = 0; t < test_set.length; t++) {
            let test = test_set[t];
            if(test.skip || (has_only && (!test.only))) {
                continue;
            }
            let test_name = test.name || t;

            let start_time = GetTime();
            let cache = null;
            if(!test.unit) {
                await sequelize.query(reset_query);
                cache = await LoadFixtures(db, fixtures);
            }
            let fixtures_time = GetTime();

            let browser = null;
            if(!test.unit) {
                /// browser preserves caches and cookies across new pages
                browser = await puppeteer.launch({
                    headless: true,
                    args: [
                        '--proxy-server="direct://"',
                        '--proxy-bypass-list=*'
                    ]
                });
            }
            let browser_time = GetTime();

            try {
                await test.test(db, browser, root_url, cache);
            } catch(err) {

                process.stdout.write("E\n");
                logger.error(`Error in ${test_set_name}/${test_name}:`);
                logger.error(err);
            }
            let test_time = GetTime();
            if(browser) {
                await browser.close();
            }
            let finish_time = GetTime();

            num_tests_run++;

            total_fixtures_time += fixtures_time - start_time;
            total_test_time += test_time - browser_time;
            total_full_time += finish_time - start_time;
            process.stdout.write(".");
            //logger.info(`TEST ${test_set_name}: ${test_name}: ${fixtures_time - start_time} sec fixtures, ${test_time - browser_time} sec test, ${finish_time - start_time} sec total`);
        }
    }

    process.stdout.write("\n");
    logger.info(`${num_tests_run} tests run, total time was: ${total_full_time.toFixed(3)} seconds total, ${total_fixtures_time.toFixed(3)} seconds for fixtures and ${total_test_time.toFixed(3)} seconds for test bodies`);

    if(clean_db) {
        await sequelize.close();
        await dev_sequelize.query(`DROP DATABASE ${db_usage};`);
    }

    logger.info("Tests complete");
}