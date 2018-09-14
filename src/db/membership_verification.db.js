
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('membership_verification', {
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
        ,indexes: [{ fields: ["user_id"] }, { fields: ["membership_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.user, { as: 'user', onDelete: 'CASCADE', foreignKey: { name: "user_id", allowNull: false }});
        this.belongsTo(models.membership, { as: 'membership', onDelete: 'CASCADE', foreignKey: { name: "membership_id", allowNull: false }});

    };

    return model;
};