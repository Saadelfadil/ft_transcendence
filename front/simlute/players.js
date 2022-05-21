const { createServer } = require('http');

const server = createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	
	const players = [ 
	  {"player_id": 1, "player_avatar": "user2.jpeg", "player_score": 10000, }, 
	  {"player_id": 2, "player_avatar": "user1.jpeg", "player_score": 1000, }, 
	  {"player_id": 3, "player_avatar": "user.jpeg", "player_score": 100, }, 
	  {"player_id": 4, "player_avatar": "user1.jpeg", "player_score": 125, }, 
	  {"player_id": 5, "player_avatar": "user.jpeg", "player_score": 45, }, 
	  {"player_id": 6, "player_avatar": "user.jpeg", "player_score": 42, }, 
	  {"player_id": 7, "player_avatar": "user1.jpeg", "player_score": 40, }, 
	  {"player_id": 0, "player_avatar": "user2.jpeg", "player_score": 35, }, 
	  {"player_id": 8, "player_avatar": "user.jpeg", "player_score": 30, }, 
	  {"player_id": 9, "player_avatar": "user1.jpeg", "player_score": 28, }, 
	  {"player_id": 10, "player_avatar":"user.jpeg" , "player_score": 26, }, 
	  {"player_id": 11, "player_avatar":"user.jpeg" , "player_score": 24, }, 
	  {"player_id": 12, "player_avatar":"user2.jpeg" , "player_score": 20, }, 
	  {"player_id": 13, "player_avatar":"user.jpeg" , "player_score": 19, }, 
	  {"player_id": 14, "player_avatar":"user1.jpeg" , "player_score": 12, }, 
	];
	res.write(JSON.stringify(players));
	return res.end();
});


server.listen(8003);
