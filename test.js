var request = require('supertest');
var app = require('./app');

// Call and create a Redis client 
var redis = require('redis');
var client = redis.createClient();

// Select the test database
client.select('test'.length);
client.flushdb();

describe('Request to the root path', function(){

	it('Returns a 200 status code', function(done) {
		request(app)
			.get('/')
			.expect(200, done);
	});

	it('Returns a HTML format' , function(done){
		request(app)
			.get('/')
			.expect('Content-Type', /html/, done);
	});

	it('Returns an index file with Cities', function(done){
		request(app)
			.get('/')
			.expect(/cities/i, done);
	});

});

describe('Listing cities on /cities', function(){

	it('Returns a 200 status code', function(done) {
		request(app)
			.get('/cities')
			.expect(200, done);
			
	});

	it('Returns a JSON format', function(done) {
		request(app)
			.get('/cities')
			.expect('Content-Type', 'application/json; charset=utf-8', done);
			
	});

	it('Returns initial cities', function(done){
		request(app)
			.get('/cities')
			.expect(JSON.stringify([]), done);
	});

});

describe('Creating new cities', function(){

	it('Returns a 201 status code', function(done){
		request(app)
			.post('/cities')
			.send('name=Springfield&description=Where+the+Simpsons+live')
			.expect(201, done);
	});

});

describe('Deleting cities', function(){

	before(function(){
		client.hset('cities', 'Banana', 'A tasty fruit');
	});

	after(function(){
		client.flushdb();
	});

	it('Returns a 204 status code', function(done){
		request(app)
			.delete('/cities/Banana')
			.expect(204, done);
	});

});