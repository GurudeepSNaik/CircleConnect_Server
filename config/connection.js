var mysql = require("mysql");

// var connection = mysql.createConnection(process.env.CONNECTION_STRING);
var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: process.env.SQL_PASSWORD,
  database: "circleconnect",
  port: 3306,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log("Connected!");
});

var client = connection;

module.exports = client;
