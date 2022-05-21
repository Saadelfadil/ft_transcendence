const { createServer } = require('http');

const server = createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	
	const rooms = [ 
	  {"room_id":0,"room_name":"room 00", "is_locked": true}, 
	  {"room_id":1,"room_name":"room 1", "is_locked": false}, 
	  {"room_id":2,"room_name":"room 1", "is_locked": false}, 
	  {"room_id":3,"room_name":"room 1", "is_locked": false}, 
	  {"room_id":4,"room_name":"room 2", "is_locked": false}, 
	  {"room_id":5,"room_name":"room 3", "is_locked": false}, 
	  {"room_id":6,"room_name":"room 4", "is_locked": false}, 
	  {"room_id":7,"room_name":"room 5", "is_locked": true}, 
	  {"room_id":8,"room_name":"room 6", "is_locked": false}, 
	  {"room_id":9,"room_name":"room 2", "is_locked": false}, 
	  {"room_id":10,"room_name":"room 3", "is_locked": false}, 
	  {"room_id":11,"room_name":"room 4", "is_locked": false}, 
	  {"room_id":12,"room_name":"room 5", "is_locked": true}, 
	  {"room_id":13,"room_name":"room 6", "is_locked": false}, 
	  {"room_id":14,"room_name":"room 2", "is_locked": false}, 
	  {"room_id":15,"room_name":"room 3", "is_locked": false}, 
	  {"room_id":16,"room_name":"room 4", "is_locked": false}, 
	  {"room_id":17,"room_name":"room 5", "is_locked": true}, 
	  {"room_id":18,"room_name":"room 6", "is_locked": false}, 
	];
	res.write(JSON.stringify(rooms));
	return res.end();
});


server.listen(8001);
