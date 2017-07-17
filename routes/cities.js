var express = require('express');
var router = express.Router();

// forces the use of the native queryString Node library !important
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

// Redis Connection 
// TODO: Create the connection as a module
var redis = require('redis');

if(process.env.REDISTOGO_URL){
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
}else{
	var client = redis.createClient();
	// Select our database from Redis
	client.select((process.env.NODE_ENV || 'development').length);
}

// Using static content
/*var cities = {
	'New York': 'The City of New York, often called New York City or simply New York, is the most populous city in the United States.',
	'San Ramon': 'San Ramón es una ciudad del condado de Contra Costa, en el estado de California (Estados Unidos). Según el censo de 2000 tenía una población de 44.722, y en 2005 contaba con 49.999 habitantes.',
	'Philadelphia': 'Filadelfia es la mayor ciudad del estado de Pensilvania, Estados Unidos. Está ubicada sobre la orilla derecha del río Delaware',
	'Chicago': 'Filadelfia es la mayor ciudad del estado de Pensilvania, Estados Unidos. Está ubicada sobre la orilla derecha del río Delaware'
}
var cities = [];*/

// Static Route
router.route('/')
	.get(function(request, response){
		
		// Reading from static content
		/*if(request.query.limit >= 0){
			response.json(cities.slice(0, request.query.limit));
		}else{
			response.json(Object.keys(cities));
		}*/

		// Reading from Redis
		client.hkeys('cities', function(error, names){
			if(error) throw error;
			
			response.json(names);
		});

	})
	.post(parseUrlencoded, function(request, response){
		var newCity = request.body;

		if(!newCity.name || !newCity.description){
			response.sendStatus(400);
			return false;
		}

		/*
		Saving using static content 

		cities[newCity.name] = newCity.description;
		// Response with code 201 (created) and the new city name
		response.status(201).json(newCity.name);*/
	
		/* Savin	 using Redis */
		client.hset('cities', newCity.name, newCity.description, function(error){
			if(error) throw error;
			
			response.status(201).json(newCity.name);
		});

	});

//Dynamic Route
router.route('/:name')
	.all(function(request, response, next){
		var name = request.params.name;
		var city = name[0].toUpperCase() + name.slice(1).toLowerCase();
		// Assigning the value to request
		request.cityName = city;
		// Call the next function in the stack
		next();
	})
	.get(function(request, response){
		// request.cityName is coming from the middleware function
		/*var description = cities[req.cityName];
	
		if(!description){
			res.status(400).json('Not found for ' + req.params.name);
		}else{
			res.json(description);
		}*/

		client.hget('cities', request.params.name, function(error, description) {
			response.render('show.ejs', { city: { name: request.params.name, description: description }});
		});
	})
	.delete(function(request, response){
		
		client.hdel('cities', request.params.name, function(error){
			if(error) throw error;
			
			response.sendStatus(204);
		});

		/*
		Whit static content
		if(cities[request.cityName]){
			delete cities[request.cityName];
			response.sendStatus(200);
		}else{
			response.sendStatus(404);
		}*/
	});


module.exports = router;