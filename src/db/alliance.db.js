
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('alliance', {
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
        ,indexes: [{ fields: ["first_organization_id"] }, { fields: ["second_organization_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.organization, { as: 'first_organization', onDelete: 'CASCADE', foreignKey: { name: "first_organization_id", allowNull: false }});
        this.belongsTo(models.organization, { as: 'second_organization', onDelete: 'CASCADE', foreignKey: { name: "second_organization_id", allowNull: false }});

        this.hasMany(models.alliance_vote, { as: "votes", foreignKey: { name: "alliance_id", allowNull: false } });

    };

    return model;
};