const { createServer } = require('http');

const server = createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	// user 0 user1 1 user2 2
	const playerHistory = [ 
	{"history_id": 0, "player_avatar_1": "user.jpeg", "player_id_1": 0, "player_avatar_2": "user1.jpeg", "player_id_2" : 1, "player_score_1": 10000, "player_score_2": 500},
	{"history_id": 1, "player_avatar_1": "user1.jpeg", "player_id_1": 1, "player_avatar_2": "user2.jpeg", "player_id_2" : 2, "player_score_1": 1500, "player_score_2": 1000},
	{"history_id": 2, "player_avatar_1": "user2.jpeg", "player_id_1": 2, "player_avatar_2": "user1.jpeg", "player_id_2" : 1, "player_score_1": 10050, "player_score_2": 450},
	{"history_id": 3, "player_avatar_1": "user2.jpeg", "player_id_1": 2, "player_avatar_2": "user1.jpeg", "player_id_2" : 1, "player_score_1": 17800, "player_score_2": 7800},
	{"history_id": 4, "player_avatar_1": "user1.jpeg", "player_id_1": 1, "player_avatar_2": "user2.jpeg", "player_id_2" : 2, "player_score_1": 100, "player_score_2": 480},
	{"history_id": 5, "player_avatar_1": "user1.jpeg", "player_id_1": 1, "player_avatar_2": "user.jpeg", "player_id_2" : 0, "player_score_1": 1080, "player_score_2": 5890},
	{"history_id": 6, "player_avatar_1": "user.jpeg", "player_id_1": 0, "player_avatar_2": "user1.jpeg", "player_id_2" : 1, "player_score_1": 18, "player_score_2": 50},
	];
	res.write(JSON.stringify(playerHistory));
	return res.end();
});


server.listen(8004);
