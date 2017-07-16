var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
// forces the use of the native queryString Node library
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var cities = {
	'New York': 'The City of New York, often called New York City or simply New York, is the most populous city in the United States.',
	'San Ramon': 'San Ramón es una ciudad del condado de Contra Costa, en el estado de California (Estados Unidos). Según el censo de 2000 tenía una población de 44.722, y en 2005 contaba con 49.999 habitantes.',
	'Philadelphia': 'Filadelfia es la mayor ciudad del estado de Pensilvania, Estados Unidos. Está ubicada sobre la orilla derecha del río Delaware'
}

// Static Route
router.route('/')
	.get(function(req, res){
		if(req.query.limit >= 0){
			res.json(cities.slice(0, req.query.limit));
		}else{
			res.json(Object.keys(cities));
		}
	})
	.post(parseUrlencoded, function(request, response){
		var newCity = request.body;
		cities[newCity.name] = newCity.description;

		// Response with code 200 and the new city name
		response.status(200).json(newCity.name);
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
	.get(function(req, res){
		// request.cityName is coming from the middleware function
		var description = cities[req.cityName];
	
		if(!description){
			res.status(400).json('Not found for ' + req.params.name);
		}else{
			res.json(description);
		}
	})
	.delete(function(request, response){
		if(cities[request.cityName]){
			delete cities[request.cityName];
			response.sendStatus(200);
		}else{
			response.sendStatus(404);
		}
	});


module.exports = router;