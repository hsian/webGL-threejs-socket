var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io")(server);
	
app.use(express.static('public'));

app.get('/', function (req, res) {
  	res.render('index', function(err, html) {
	  	res.send(html);
	});
});


var userInfo = {
	items: {},
	length: 0  
};
var roomInfo = {};

io.on('connection', function (socket) {

	var clientId = socket.client.id;
 
	socket.on('registe', function(){

		var id = socket.client.id;

		userInfo.items[id] = {
			id: id
		}

		userInfo.length += 1;

		socket.emit('registe', { 
	        id : id,
	        msg : 'registe successed',
	        code : 0
	    })
	});


	socket.on('enter', function(id){

		//加入房间
	    socket.join(id);

	    roomInfo[id] = {
			id: id,
			//clients: socket.client.id
		} 

		console.log(userInfo)

		io.sockets.in(id).emit('enter', userInfo.items)

		socket.on("ready", function(data){

			//var isAllReady = false;
			//userInfo[clientId]["ready"] = data;

			if(userInfo.length == 2){
				io.sockets.in(id).emit('ready',true)
			}
			
		})

		
	});

	socket.on("animation", function(data){
			
		var res = {};
		var items = userInfo.items;

		for(var key in items){
			var val = items[key];

			if(clientId == val.id){
				res[clientId] = {
					radius: data.radius
				}
			}else{
				res[val.id] = {
					radius: val.radius || false
				}
			}
		}

		io.sockets.in("room1").emit('animation',res)
	});

	socket.on('character', function(data){
		var id = "room1";
		var chars = roomInfo[id]["characters"];

		if(!chars){
			chars = {};
		}

		chars[clientId] = {
			clientId: clientId,
			character: data
		}

		roomInfo[id]["characters"] = chars;

		if(Object.keys(chars).length == 2){
			io.sockets.in(id).emit('character',chars)
		}
	});
});



var server = server.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});