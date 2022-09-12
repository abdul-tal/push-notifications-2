const Sequelize = require("sequelize");
const databaseConString = 'mysql://admin:pushdbpass@push-db-test.cnzbsftqo00c.us-east-1.rds.amazonaws.com/push_test'
const sequelize = new Sequelize(databaseConString, { pool: { acquire: 2000 }});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.subscriptions = require("./subscriptions")(sequelize, Sequelize);

module.exports = db;

// const str = 'https://abab.cdcd.com';
// const subdomain = str.split('.')[0].slice(str.indexOf('//')+2)
// console.log('subdomain', subdomain)

// let mysql = require('mysql');

// let connection = mysql.createConnection({
//     host: 'sql6.freemysqlhosting.net',
//     user: 'sql6517263',
//     password: 'SZPCrfd1C1',
//     database: 'sql6517263'
// });

// connection.connect(function(err) {
//     if (err) {
//       return console.error('error: ' + err.message);
//     }
  
//     console.log('Connected to the MySQL server.');
//   });
