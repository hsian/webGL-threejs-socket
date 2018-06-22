
var Character = function(stage){
	this.stage = stage;
	this.completed = false;
	self.mesh = null;
}

Character.loader = function(fn){
	var loader = new THREE.JSONLoader();
	var self = this;

	loader.load('./assert/horse.js', function(geometry, materials){
		//var material = materials[0];
		//material.morphTargets = true;
		//material.color.setHex(0xffaaaa);
		
		var material = new THREE.MeshLambertMaterial( { color: 0xffaa55, morphTargets: true, vertexColors: THREE.FaceColors } );
		
		material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );
		

		//var mesh = new THREE.Mesh(geometry, materials);
		var mesh = new THREE.Mesh(geometry, material);

		mesh.position.set(0,0,0);

		var s = THREE.Math.randFloat(0.575, 0.5);
		mesh.scale.set(s,s,s);

		//mesh.rotation.y = -180 *Math.PI / 180;
		mesh.rotation.y = -Math.PI / 2;

		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();

		self.stage.mixer.clipAction(geometry.animations[0], mesh)
			.setDuration(1)
			.startAt(-Math.random())
			.play();

		mesh.castShadow = true;
		mesh.receiveShadow = true;

		fn(mesh);
	})
}

Character.prototype.create = function(){
	var self = this;
	this.instance = new THREE.Object3D();

	if(self.completed && self.mesh){
		self.instance.add(self.mesh)
		self.stage.scene.add(self.instance);
		return;
	}

	Character.loader.call(this, function(mesh){
		self.mesh = mesh;
		self.completed = true;
		self.instance.add(mesh)
		self.stage.scene.add(self.instance);
	});
}

Character.prototype.remove = function(){
	this.stage.scene.remove(this.instance);
}

Character.prototype.animate = function(){
	this.stage.mixer.update(this.stage.clock.getDelta());
}

Character.prototype.stop = function(){

	// 停止全部了
	this.mixer.stopAllAction();
}