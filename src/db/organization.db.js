
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('organization', {
        id: {
            type: DataTypes.UUID
            ,defaultValue: DataTypes.UUIDV4
            ,primaryKey: true
        }
        ,type: {
            type: DataTypes.STRING
            ,allowNull: false
        }
        ,name: {
            type: DataTypes.STRING
            ,allowNull: false
        }
        ,json: {
            type: DataTypes.JSONB
            ,allowNull: false
        }
    }, {
        freezeTableName: true
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id, type: this.type, name: this.name };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.hasMany(models.membership, { as: "memberships", foreignKey: { name: "organization_id", allowNull: false } });
        this.hasMany(models.alliance, { as: "alliances", foreignKey: { name: "first_organization_id", allowNull: false } });
        this.hasMany(models.document, { as: "documents", foreignKey: { name: "organization_id", allowNull: false } });
        this.hasMany(models.rule, { as: "rules", foreignKey: { name: "organization_id", allowNull: false } });

    };

    return model;
};