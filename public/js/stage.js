
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

var Stage = function(container){
	
    // scene
	this.scene = Stage.scene();

	this.camera = Stage.camera();

	var lights = Stage.lights();

	for(var i = 0; i < lights.length; i++){
		this.scene.add(lights[i])
	}
	
	this.renderer = Stage.renderer();
	
	this.mixer = new THREE.AnimationMixer(scene);

	this.clock = new THREE.Clock();
	
	container.appendChild(this.renderer.domElement);
}

Stage.scene = function(){
	var scene = new THREE.Scene();
	this.scene.background = new THREE.Color( 0x59472b );

	// GROUND

	var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
	var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );

	var ground = new THREE.Mesh( geometry, planeMaterial );

	ground.position.set( 0, 0, 0 );
	ground.rotation.x = - Math.PI / 2;
	ground.scale.set( 100, 100, 100 );

	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );

	/*var gt = new THREE.TextureLoader().load( "./images/grasslight-big.jpg" );
	var gg = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight + 200 );
	var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

	var ground = new THREE.Mesh( gg, gm );

	ground.rotation.x = - Math.PI / 2;
	ground.position.set( 0, 0, 0 );

	ground.castShadow = false;
	ground.receiveShadow = true;

	scene.add( ground );*/

	return scene;
}

Stage.camera = function(){

	var camera;
	camera = new THREE.OrthographicCamera(-screenWidth / 2,screenWidth / 2,screenHeight / 2, screenHeight / -2, 1,1000);
	camera.position.set(0, 500, 200); // 500 = 1000 / 2

	return camera;
}

Stage.lights = function(){

	// lights
	var ambientLight = new THREE.AmbientLight(0x444444);

	/*var pointLight = new THREE.PointLight(0xff4400, 5 ,30);
	pointLight.position.set(5,0,0);
	this.scene.add(pointLight);*/

	var spotLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2 );
	spotLight.position.set( 0, 1500, 0 );
	spotLight.target.position.set( 100, 100, 1000);

	spotLight.castShadow = true;

	spotLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, screenWidth / screenHeight, 500, 3000 ) );
	spotLight.shadow.bias = 0.0001;

	spotLight.shadow.mapSize.width = screenWidth;
	spotLight.shadow.mapSize.height = screenHeight;

	return [ambientLight, spotLight]
}

Stage.renderer = function(){

	var renderer;

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( screenWidth, screenHeight );

	// 设置背景颜色
	//this.renderer.setClearColor( "#9bdff1", 1 );

	// 设置阴影
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;

	return renderer;
}

Stage.prototype.render = function(fn){
	var self = this;

	self.camera.lookAt(self.scene.position); // 0,0,0
	self.renderer.render(self.scene, self.camera);	
}
