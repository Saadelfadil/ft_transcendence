const { createServer } = require('http');
const axios = require('axios');

const server = createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	
	const response = axios({
		method: 'get',
		url: `http://${process.env.VUE_APP_HOST_IP}:3000/api/user`,
		withCredentials: true
	}).then((response) => {
		console.log(response);
		return response;
	}, (error) => {
		console.log(error);
	});
	console.log("jfgksjfs", response);

    const data = {

	"user":{
		"user_name" : "sfdsd",
		"user_id": 1,
		"avatar_file_name": "asdhasd.png"
	}
      };
	res.write(JSON.stringify(data));
	return res.end();
});


server.listen(7000);
