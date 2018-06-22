
var Fishbone = function(stage){
	var self = this;

	this.stage = stage;

	this.G = 40;

	this.instance = null;

	this.instances = [];

	this.show = false;

	this.id = "fb" + Date.now()
}

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

Fishbone.loader = function(){
	var a = 50,
        b = 200,
        c = 50;

    var geometry = new THREE.BoxGeometry( a, b, c );

    for ( var i = 0; i < geometry.faces.length; i+=2 ) {
		var hex = Math.random() * 0xffffff;
		geometry.faces[ i ].color.setHex( hex );
		geometry.faces[ i + 1 ].color.setHex( hex );

	}

	var material = new THREE.MeshBasicMaterial( { 
		vertexColors: THREE.FaceColors, 
		overdraw: 0.5 
	} );

	var cube = new THREE.Mesh( geometry, material );  
	cube.rotation.y = 45 * Math.PI / 180;
	cube.castShadow = true;

	return cube;  
}

Fishbone.prototype.create = function(){
	this.instance = Fishbone.loader();
	this.instance.isAnimation = true;

	this.instances.push(this.instance);
	this.instance.position.y = window.innerHeight + 200;//200 / 2; // 1000的camera + 500的cameraY轴
	this.instance.position.x = Math.random() * screenWidth - (screenWidth / 2);
	this.instance.position.z = Math.random() * screenHeight - (screenHeight / 2);

	if(this.instance.position.x > screenWidth / 2 - 50){
		this.instance.position.x = screenWidth / 2 - 50
	}

	if(this.instance.position.x < -screenWidth / 2 + 50){
		this.instance.position.x = -screenWidth / 2 + 50
	}

	this.stage.scene.add(this.instance)
}

Fishbone.prototype.remove = function(){
	this.stage.scene.remove(this.instance);
	this.instances = [];
}

Fishbone.prototype.animate = function(){
	if(!this.instance) return;

	if(this.instance.isAnimation){
		this.instance.position.y -= this.G;
	}

	if(this.instance.position.y <= 200 / 2){
		this.stop();
	}
}

Fishbone.prototype.stop = function(){
	if(!this.instance) return;
	this.instance.isAnimation = false;
}