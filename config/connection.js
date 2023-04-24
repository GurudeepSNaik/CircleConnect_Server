var mysql = require('mysql');

var connection = mysql.createConnection(process.env.CONNECTION_STRING);

connection.connect(function (err) {
  if (err) {
    console.log(err)
    throw err
  };
  console.log("Connected!");
});

var client = connection

module.exports = client