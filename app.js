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

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});