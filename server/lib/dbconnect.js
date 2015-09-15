var config = require("../env/development.js");
var mysql = require('mysql');
var cfg = config.mysql;

var connection = mysql.createConnection({
    host: cfg.host,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,

});

connection.connect(function (err) {
    if (err) {
	console.error("error connecting db: " + err.stack);
	return;
    }

});

module.exports = connection;