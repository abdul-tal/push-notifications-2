module.exports = (sequelize, Sequelize) => {
    const Subscriptions = sequelize.define("subscriptions", {
        id: {
            type: Sequelize.UUIDV4,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        category: {
            type: Sequelize.STRING
        },
        subscription: {
            type: Sequelize.STRING
        },
        endpoint: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'Subscriptions'
    });
  
    return Subscriptions;
  };