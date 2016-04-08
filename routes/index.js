var express = require('express'),
	router = express.Router();
	mysql = require('mysql');

var connection;
var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  connection = mysql.createConnection(process.env.JAWSDB_URL);;
} else {
	var config = require('./../config.json');
  	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: config.password,
		database: 'portfolio'
	});
}

connection.connect();

router.get('/', function(req, res, next){
	connection.query("SELECT * FROM projects", function(err, rows, fields){
		if(err) throw err;

		res.render('index', {
			"projects" : rows
		});
	});
});

router.get('/details/:id', function(req, res, next){
	connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(err, rows, fields){
		if(err) throw err;

		res.render('details', {
			"project" : rows[0]
		});
	});
});

module.exports = router;
