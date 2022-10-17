const Sequelize = require("sequelize");
const databaseConString = 'mysql://admin:pushdbpass@push-db-test.cnzbsftqo00c.us-east-1.rds.amazonaws.com/push_test'
const sequelize = new Sequelize(databaseConString, { 
    pool: { acquire: 2000 },
    dialectOptions: {
        connectTimeout: 60000
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.subscriptions = require("./subscriptions")(sequelize, Sequelize);
db.topics = require("./topics")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

module.exports = db;
