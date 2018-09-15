
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('document', {
        id: {
            type: DataTypes.UUID
            ,defaultValue: DataTypes.UUIDV4
            ,primaryKey: true
        }
        ,type: {
            type: DataTypes.STRING
            ,allowNull: false
        }
        ,stage: {
            type: DataTypes.INTEGER
            ,allowNull: false
        }
        ,text: {
            type: DataTypes.TEXT
            ,allowNull: false
        }
        ,json: {
            type: DataTypes.JSONB
            ,allowNull: false
        }
    }, {
        freezeTableName: true
        ,indexes: [{ fields: ["organization_id"] }, { fields: ["document_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.organization, { as: 'organization', onDelete: 'CASCADE', foreignKey: { name: "organization_id", allowNull: false }});
        this.belongsTo(models.document, { as: 'parent', onDelete: 'CASCADE', foreignKey: { name: "document_id", allowNull: true }});

        this.hasMany(models.document, { as: "children", foreignKey: { name: "document_id", allowNull: true } });
        this.hasMany(models.vote, { as: "votes", foreignKey: { name: "document_id", allowNull: false } });

        this.hasMany(models.document_connection, { as: "connections", foreignKey: { name: "first_document_id", allowNull: false } });

    };

    return model;
};