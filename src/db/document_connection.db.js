
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('document_connection', {
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
        ,indexes: [{ fields: ["first_document_id"] }, { fields: ["second_document_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.document, { as: 'first_document', onDelete: 'CASCADE', foreignKey: { name: "first_document_id", allowNull: false }});
        this.belongsTo(models.document, { as: 'second_document', onDelete: 'CASCADE', foreignKey: { name: "second_document_id", allowNull: false }});

    };

    return model;
};