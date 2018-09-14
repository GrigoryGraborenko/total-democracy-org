
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('rule', {
        id: {
            type: DataTypes.UUID
            ,defaultValue: DataTypes.UUIDV4
            ,primaryKey: true
        }
        ,json: {
            type: DataTypes.JSONB
            ,allowNull: false
        }
    }, {
        freezeTableName: true
        ,indexes: [{ fields: ["organization_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.organization, { as: 'organization', onDelete: 'CASCADE', foreignKey: { name: "organization_id", allowNull: false }});

        this.hasMany(models.rule_vote, { as: "rule_votes", foreignKey: { name: "rule_id", allowNull: false } });

    };

    return model;
};