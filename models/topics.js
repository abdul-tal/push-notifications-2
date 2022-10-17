module.exports = (sequelize, Sequelize) => {
    const Topics = sequelize.define("topics", {
        id: {
            type: Sequelize.UUIDV4,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false
        },
        customer: {
            type: Sequelize.STRING
        },
        topic: {
            type: Sequelize.STRING
        },
        subscriptionId: {
            type: Sequelize.UUIDV4,
            allowNull: false
        }
    }, {
        tableName: 'Topics',
        underscored: true
    });

    Topics.associate = (models) => {
        Topics.belongsTo(models.subscriptions, {
            foreignKey: 'subscription_id'
        });
    };
  
    return Topics;
  };
  