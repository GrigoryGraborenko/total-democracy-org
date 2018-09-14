
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('alliance_vote', {
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
        ,indexes: [{ fields: ["user_id"] }, { fields: ["alliance_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.user, { as: 'user', onDelete: 'CASCADE', foreignKey: { name: "user_id", allowNull: false }});
        this.belongsTo(models.alliance, { as: 'alliance', onDelete: 'CASCADE', foreignKey: { name: "alliance_id", allowNull: false }});

    };

    return model;
};