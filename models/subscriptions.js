module.exports = (sequelize, Sequelize) => {
    const Subscriptions = sequelize.define("subscriptions", {
        id: {
            type: Sequelize.UUIDV4,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        customer: {
            type: Sequelize.STRING
        },
        subscription: {
            type: Sequelize.STRING
        },
        endpoint: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'Subscriptions',
        underscored: true
    });

    Subscriptions.associate = (models) => {
        Subscriptions.hasMany(models.topics, {
            onDelete: 'cascade'
        });
    };
  
    return Subscriptions;
  };