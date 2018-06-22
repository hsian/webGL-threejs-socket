
var clientId;

var container = document.getElementById("container");
var scene;
var camera;
var renderer;
var clock;
var crash = false;
var crashId;
var threeEnd = false;
var isEnd = false;

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var speed = 5;
var spaceTime = 500;
var force = 0.95;
var lastCrash = false;
var lastX;
var lastZ;
var lastRotation;
var rafId;
var isCreate = false;

var stage, 
	characters = [],
	player = [],
 	fishbone;

var socket = io();

socket.emit('registe', "san" + Date.now());
socket.emit('enter', "room1");

socket.on('registe', function (data) {
    console.log("注册成功");

    clientId = data.id;
});

socket.on('enter', function(data){
	console.log("加入房间成功");

	for(var key in data){
		player.push(data[key]["id"]);
	}


	//gameStart();

})

socket_ready();

socket_createPlayer();


// socket函数不能放到socket回调 否则会被多次绑定
function socket_ready(){
	socket.emit('ready',{
		roomId: "room1"
	})	
	 
	socket.on('ready', function(data){

		if(!isCreate){
			main();
			createPlayer();		
		}
	})
}

function socket_createPlayer(){
	socket.on("character", function(data){
		for(var key in data){
			var character = new Character(stage);
			character.id = key;
			characters.push(character);

			character.create();
			character.instance.position.x =  data[key].character.x;
			character.instance.rotation.y =  data[key].character.y;
		}

		isCreate = true;
	})
}  

function main(){
	stats = new Stats();
	container.appendChild( stats.dom );
	stage = new Stage(container);
	

	fishbone = new Fishbone(stage);
	
	fishbone.create();

	bindEvent();

	animate();
  
	//gameStart();
}

function createPlayer(){ 

	socket.emit('character', {
		x: Math.random() * 400 - 200,
		y:  Math.random() * Math.PI * 2
	});
}

function bindEvent(){
	var startX,startY, tarX, tarY, disX, disY;
	var radius = false;

	function start(event){
		event.preventDefault();

		var touch = event.touches[0];
		startX = touch.pageX;
		startY = touch.pageY;
	} 

	function move(event){
		event.preventDefault();

		var touch = event.touches[0];
		tarX = touch.pageX;
		tarY = touch.pageY;

		disX = startX - tarX;
		disY = tarY - startY;
		radius = Math.atan2(disY, disX);

		socket.emit('animation', { radius: radius });
	}
	
	function end(event){
		event.preventDefault();
		radius = false;
	}	

	container.addEventListener('touchstart', start);
	container.addEventListener('touchmove', move);
	container.addEventListener('touchend', end);
}


function detectorUpdate(character){
	var role = character.mesh;
	var originPoint = role.position.clone();

	for(var i = 0; i < role.geometry.vertices.length; i++){
		var localVertex = role.geometry.vertices[i].clone();

		// 顶点经过变换后的坐标
		var globalVertex = localVertex.applyMatrix4(role.matrix);
		var directionVector = globalVertex.sub(role.position);

		var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

		var collisionResults = ray.intersectObjects(fishbone.instances);
		if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            crash = true;
            crashId = collisionResults[0].object.name;
            break;
        }

        crash = false;
	}
}

function animateByRotation(character,rotation){
	if(rotation !== false){
		character.animate();
		character.instance.rotation.y = rotation

		if(Math.abs(character.instance.position.x) >= screenWidth / 2){
			character.instance.position.x = (Math.abs(lastX) / lastX) * (Math.abs(lastX) - speed);
		}else{
			character.instance.position.x -= Math.cos(rotation) * speed;
			lastX = character.instance.position.x;
		}

		if(Math.abs(character.instance.position.z) > screenHeight / 2){
			character.instance.position.z = (Math.abs(lastZ) / lastZ) * (Math.abs(lastZ) - speed);
		}else{
			character.instance.position.z += Math.sin(rotation) * speed;
			lastZ = character.instance.position.z;
		}

		lastRotation = rotation;

		//console.log(Math.sin(rotation) * speed)

		// 赋值已用来判断碰撞检测
		character.mesh.position.x = character.instance.position.x;
		character.mesh.position.z = character.instance.position.z;
	}
}

var ii = 0;

function animate(){

	rafId = requestAnimationFrame(animate);

	if(!isCreate) return;

	stage.render();
	stats.update();

	//if(character.completed && threeEnd){
	/*if(characters[0] && characters[0].completed){	
		//detectorUpdate();
		fishbone.animate();
	}*/
}

 
socket.on('animation', function (data) {

	for(var i = 0, char; char = characters[i++];){
		var rotation = data[ char["id"] ]["radius"];

		animateByRotation(char, rotation);
	}	
});


function gameStart(){
	//gameOverShow();

	/*startCountDown(function(){
		countDown(0.1);

		setTimeout(function(){
			fishbone.create();
		},1000)
		
	});*/
}


