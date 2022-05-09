const { createServer } = require('http');

const server = createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	
	const rooms = [ 
	  {"msg_id":0, "msg_data":"message 00","msg_time": "10:20","user_msg": false, "msg_user_name": "user 1"}, 
	  {"msg_id":1, "msg_data":"message 1", "msg_time": "11:20","user_msg": false, "msg_user_name": "user 2"}, 
	  {"msg_id":2, "msg_data":"message 1", "msg_time": "12:20","user_msg": false, "msg_user_name": "user 3"}, 
	  {"msg_id":3, "msg_data":"message 1", "msg_time": "13:20","user_msg": false, "msg_user_name": "user 4"}, 
	  {"msg_id":4, "msg_data":"message 2", "msg_time": "14:20","user_msg": false, "msg_user_name": "user 5"}, 
	  {"msg_id":5, "msg_data":"message 3", "msg_time": "15:20","user_msg": false, "msg_user_name": "user 6"}, 
	  {"msg_id":6, "msg_data":"message 4", "msg_time": "16:20","user_msg": false, "msg_user_name": "user 7"}, 
	  {"msg_id":7, "msg_data":"message 5", "msg_time": "17:20","user_msg": false, "msg_user_name": "user 8"}, 
	  {"msg_id":8, "msg_data":"message 6", "msg_time": "18:20","user_msg": false, "msg_user_name": "user 9"}, 
	  {"msg_id":9, "msg_data":"message 2", "msg_time": "19:20","user_msg": false, "msg_user_name": "user 10"}, 
	  {"msg_id":10,"msg_data":"message 3", "msg_time": "20:20","user_msg": false, "msg_user_name": "user 11"}, 
	  {"msg_id":11,"msg_data":"message 4", "msg_time": "20:21","user_msg": false, "msg_user_name": "user 12"}, 
	  {"msg_id":12,"msg_data":"message 5", "msg_time": "20:22","user_msg": false, "msg_user_name": "user 13"}, 
	  {"msg_id":13,"msg_data":"message 6", "msg_time": "20:23","user_msg": false, "msg_user_name": "user 14"}, 
	  {"msg_id":14,"msg_data":"message 2", "msg_time": "20:24","user_msg": false, "msg_user_name": "user 15"}, 
	  {"msg_id":15,"msg_data":"message 3", "msg_time": "20:25","user_msg": false, "msg_user_name": "user 16"}, 
	  {"msg_id":16,"msg_data":"message 4", "msg_time": "20:26","user_msg": false, "msg_user_name": "user 17"}, 
	  {"msg_id":17,"msg_data":"message 5", "msg_time": "22:20","user_msg": false, "msg_user_name": "user 18"}, 
	  {"msg_id":18,"msg_data":"message 6", "msg_time": "23:20","user_msg": false, "msg_user_name": "user 19"}, 
	];
	res.write(JSON.stringify(rooms));
	return res.end();
});


server.listen(8002);
