
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('membership', {
        id: {
            type: DataTypes.UUID
            ,defaultValue: DataTypes.UUIDV4
            ,primaryKey: true
        }
        ,type: {
            type: DataTypes.STRING
            ,allowNull: false
        }
        ,json: {
            type: DataTypes.JSONB
            ,allowNull: false
        }
    }, {
        freezeTableName: true
        ,indexes: [{ fields: ["user_id"] }, { fields: ["organization_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.user, { as: 'user', onDelete: 'CASCADE', foreignKey: { name: "user_id", allowNull: false }});
        this.belongsTo(models.organization, { as: 'organization', onDelete: 'CASCADE', foreignKey: { name: "organization_id", allowNull: false }});

        this.hasMany(models.membership_verification, { as: "verifications", foreignKey: { name: "membership_id", allowNull: false } });

    };

    return model;
};