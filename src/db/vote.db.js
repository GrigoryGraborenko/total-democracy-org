
module.exports = function(Sequelize, DataTypes) {
    var model = Sequelize.define('vote', {
        id: {
            type: DataTypes.UUID
            ,defaultValue: DataTypes.UUIDV4
            ,primaryKey: true
        }
        ,yes_vote: {
            type: DataTypes.BOOLEAN
            ,allowNull: true
        }
        ,comment: {
            type: DataTypes.TEXT
            ,allowNull: true
        }
        ,json: {
            type: DataTypes.JSONB
            ,allowNull: false
        }
    }, {
        freezeTableName: true
        ,indexes: [{ fields: ["user_id"] }, { fields: ["document_id"] }]
        ,getterMethods: {
            public : function() {
                var obj = { id: this.id };

                return obj;
            }
        }
    });

    model.associate = function (models) {

        this.belongsTo(models.user, { as: 'user', onDelete: 'CASCADE', foreignKey: { name: "user_id", allowNull: false }});
        this.belongsTo(models.document, { as: 'document', onDelete: 'CASCADE', foreignKey: { name: "document_id", allowNull: false }});

    };

    return model;
};