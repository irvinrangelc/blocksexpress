var express = require('express');
var app = express();
var logger = require('./logger');

// Using Middlewares
app.use(logger);

// Be able to serve all the statics files in public folder
app.use(express.static('public'));

var blocks = require('./routes/blocks');
app.use('/blocks', blocks);

// Examples of Redirections
app.get('/myblocks', function(req, res){
	res.redirect(301, '/blocks');
});

// We've encapsulated our app in a module, 
// to execute our app we must write in our console the following
// ./bin/wwww

module.exports = app;