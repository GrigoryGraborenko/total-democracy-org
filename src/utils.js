
const fs = require("fs");
const util = require('util');
const Sequelize = require('sequelize');
const crypto = require('crypto');
const zlib = require('zlib');

import moment from "moment"

const fileReadAsync = util.promisify(fs.readFile);
const fileWriteAsync = util.promisify(fs.writeFile);
const fileDeleteAsync = util.promisify(fs.unlink);
const randomBytesAsync = util.promisify(crypto.randomBytes);
const inflateAsync = util.promisify(zlib.inflate);
const deflateAsync = util.promisify(zlib.deflate);

////////////////////////////////////////////////////////////////////////////////
export function GetTime() { var t = process.hrtime(); return t[0] + t[1] * 0.000000001; }
const g_ServerStartTimestamp = moment().unix();
const g_ServerStartHiResTime = GetTime();
export function GetUnixTime() { return (g_ServerStartTimestamp + (GetTime() - g_ServerStartHiResTime)); }

////////////////////////////////////////////////////////////////////////////////
export function Delay(delay) { return new Promise(function(fulfill, reject) { setTimeout(function() { fulfill(); }, delay); }); }

////////////////////////////////////////////////////////////////////////////////
export async function InitFixtures(file_name) {

    if(!file_name) {
        file_name = "./src/test_fixtures.json";
    }

    var fixtures_data = fs.readFileSync(file_name);
    var fixtures = JSON.parse(fixtures_data + "");

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

    return { fixtures: fixtures, reset_query: reset_query };
}

////////////////////////////////////////////////////////////////////////////////
export async function LoadFixtures(db, fixtures, fixture_seed) {

    var cache = Object.assign({}, fixture_seed);
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

        var nouns = ["orange", "apple", "car", "mountain", "cup", "plate", "void", "airport", "tree", "volcano", "building", "nest", "basket", "hat", "eye", "brain", "chair", "floor"];
        var adjectives = ["fast", "slow", "infinite", "purple", "dire", "epic", "amazing", "super", "decrepit", "rotten", "insane", "inverted"];
        var verbs = ["running", "walking", "spinning", "hurtling", "oscillating", "collapsing", "decaying", "imploding", "exploding", "rotating", "plummeting", "teleporting"];

        for(let i = 0; fixture.templates && (i < fixture.templates.length); i++) {

            let template = fixture.templates[i];
            for(let n = 0; n < template.number; n++) {

                let obj = Object.assign({}, template.parameters);
                for(let key in obj) {
                    if(cache[obj[key]] !== undefined) {
                        obj[key] = cache[obj[key]];
                    } else if(Array.isArray(obj[key])) {
                        obj[key] = obj[key][Math.floor(Math.random() * obj[key].length)];
                    } else if(typeof obj[key] === "string") {
                        var str = obj[key];

                        var replacements = [
                            { search: ":index", call: function() { return (n + 1); } }
                            ,{ search: ":num", call: function() { return Math.floor(Math.random() * 10); } }
                            ,{ search: ":letter", call: function() { return String.fromCharCode(Math.floor(Math.random() * 26) + 65); } }
                            ,{ search: ":noun", call: function() { return nouns[Math.floor(Math.random() * nouns.length)]; } }
                            ,{ search: ":adjective", call: function() { return adjectives[Math.floor(Math.random() * adjectives.length)]; } }
                            ,{ search: ":verb", call: function() { return verbs[Math.floor(Math.random() * verbs.length)]; } }
                        ];
                        while(replacements.length > 0) {
                            let new_str = str.replace(replacements[0].search, replacements[0].call() + "");
                            if(new_str === str) {
                                replacements.shift();
                            }
                            str = new_str;
                        }
                        obj[key] = str;
                    }
                }

                await db[fixture.table].create(obj);
            }
        }
    }
    return cache;
}