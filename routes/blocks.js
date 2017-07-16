var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
// forces the use of the native queryString Node library
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var blocks = {
	'Fixed': 'Fastened securely in position',
	'Movable': 'Capable of being moved',
	'Rotating': 'Moving in a circle around its center'
}

// Static Route
router.route('/')
	.get(function(req, res){
		if(req.query.limit >= 0){
			res.json(blocks.slice(0, req.query.limit));
		}else{
			res.json(Object.keys(blocks));
		}
	})
	.post(parseUrlencoded, function(request, response){
		var newBlock = request.body;
		blocks[newBlock.name] = newBlock.description;

		// Response with code 200 and the new block name
		response.status(200).json(newBlock.name);
	});

//Dynamic Route
router.route('/:name')
	.all(function(request, response, next){
		var name = request.params.name;
		var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
		// Assigning the value to request
		request.blockName = block;
		// Call the next function in the stack
		next();
	})
	.get(function(req, res){
		// request.blockName is coming from the middleware function
		var description = blocks[req.blockName];
	
		if(!description){
			res.status(400).json('Not found for ' + req.params.name);
		}else{
			res.json(description);
		}
	})
	.delete(function(request, response){
		if(blocks[request.blockName]){
			delete blocks[request.blockName];
			response.sendStatus(200);
		}else{
			response.sendStatus(404);
		}
	});


module.exports = router;