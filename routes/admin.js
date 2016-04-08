var express = require('express'),
	router = express.Router(),
	multer = require('multer'),
	upload = multer({dest: './public/images/portfolio'}),
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

		res.render('admin/index', {
			"projects" : rows
		});
	});
});

router.get('/add', function(req, res, next){
	res.render('admin/add');
});

router.post('/add', upload.single('projectimage'), function(req, res, next){
	// Get Form Values
	var title     = req.body.title;
	var description = req.body.description;
	var service   = req.body.service;
	var url   = req.body.url;
	var client    = req.body.client;
	var projectdate = req.body.projectdate;

	// Check Image Upload
	if(req.file){
	var projectImageName = req.file.filename
	} else {
	var projectImageName = 'noimage.jpg';
	}

	// Form Field Validation
	req.checkBody('title', 'Title field is required').notEmpty();
	req.checkBody('service', 'Service field is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('admin/add', {
			errors: errors,
			title: title,
			description: description,
			service: service,
			client: client,
			url: url
		});
	} else {
		var project  = {
			title: title,
			description: description,
			service: service,
			client: client,
			date: projectdate,
			url: url,
			image: projectImageName
		};
	}

	var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
		console.log('Error: '+err);
		console.log('Success: '+result);
	});

	req.flash('success_msg', 'Project Added');
	res.redirect('/admin');
});

module.exports = router;
