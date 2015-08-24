$(document).ready(function(){
	var display = $('#webGLContainer');
	var scene = new THREE.Scene();	// create the scene
	var finalPos = [];
	var randomPosArray = [];
	
	//create the cam
	var camera = new THREE.PerspectiveCamera(10, display.width()/display.height(), 0.1, 10000);     
	camera.position.z = 1500;
	camera.position.y = 5;
	camera.position.x = 0;
	scene.add(camera);
	
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(display.width(), display.height());
	renderer.setClearColor(0x000000, 1);
	display.append(renderer.domElement);
	
	
	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	light.castShadow = true;

	light.shadowCameraNear = 200;
	light.shadowCameraFar = camera.far;
	light.shadowCameraFov = 50;

	light.shadowBias = -0.00022;
	light.shadowDarkness = 0.5;

	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;

	scene.add( light );
	
	
/*	var geometry = new THREE.BoxGeometry(10,10,10);
	var material;
	var count = 5;
	var cubeArray = [];
	
	for(var x=0; x<count; x++){
		material = new THREE.MeshLambertMaterial({color: Math.random()* 0xffffff});
		
		cubeArray[x] = new THREE.Mesh(geometry, material);
		
		pos(cubeArray[x], x, count);
		
		finalPos.push(cubeArray[x].position.x, cubeArray[x].position.y, cubeArray[x].position.z);
		
		randomPos(cubeArray[x], x, count);
		
		randomPosArray.push(cubeArray[x].position.x, cubeArray[x].position.y, cubeArray[x].position.z);
		
		scene.add(cubeArray[x]);
	}
	*/
	
	var gameGrid = [];
	var dragingCubes = [];
	var gridGeo, gridMat, dragMat;
	gridGeo = new THREE.BoxGeometry(10,10,10);
	gridMat = new THREE.MeshLambertMaterial({color: 0xBDBDBD, transparent: true, opacity: 1});
	var j = 0;
	var line = 0;
	var startY = 50;
	count = 5;	
	
	for(var i=0; i<100; i++){
		gameGrid[i] = new THREE.Mesh(gridGeo, gridMat);
		scene.add(gameGrid[i]);
		
		if(j == 10){
			line++;
			j = 0;
		}
		
		gameGrid[i].position.x = (j*7- ((10-j)*7) );
		gameGrid[i].position.y = startY - line*15;
		j++;
	}
	
	line = 1;
		
	for(var x=0; x<count; x++){
		dragMat = new THREE.MeshLambertMaterial({color: Math.random()* 0xffffff});
		
		dragingCubes[x] = new THREE.Mesh(gridGeo, dragMat);
		scene.add(dragingCubes[x]);
		
		
		if(j == 10){
			line++;
			j = 0;
		}
		
		dragingCubes[x].position.x =  (j*7- ((10-j)*7) );
		dragingCubes[x].position.y = startY + line*15;
		
		j++;
	}
		
	
	
	
	
	render();
	
	
	function render(){
		//fade();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	function fade(){
		for(var i=0; i<gameGrid.length; i++){
			gameGrid[i].material.opacity -= 0.00005;
		}
	}
	
	function createSpline(){
		var currentX = getCurrentX(0);
		var currentY = getCurrentY(0);
		var currentZ = getCurrentZ(0);
		
		var finalX = getFinalX(0);
		var finalY = 0;
		var finalZ = 0;
		
		var smootheness = 100;
		
		
		
			
		
		
		var geometry = new THREE.Geometry();
		var material = new THREE.LineBasicMaterial({color: 0xffffff});
		
		var spline = new THREE.SplineCurve3([
											 new THREE.Vector3(currentX, currentY, currentZ), 
											 new THREE.Vector3(currentX+30, currentY-10 , currentZ-10),
											 new THREE.Vector3(finalX, finalY, finalZ)
											 ]);
	
		var splinePoints = spline.getPoints(smootheness);
	
		for(var i=0; i< splinePoints.length; i++){
			geometry.vertices.push(splinePoints[i]);
		}
	
		var line = new THREE.Line(geometry, material);
		scene.add(line);
	
		render();
	}
	
	
	
	
	
	
	
	
	
	
	function pos(object, x, count){
		
		object.position.x = (x*20-  ((count-x)*20) );
		
		
	}
	
	function randomPos(object){
		object.position.x = (Math.random()*75);
		object.position.y = (Math.random()*75);
		
		
	}
	
	
	function getFinalX(n){
		var finalX = finalPos[3*n];
		return finalX;
	}
	
	function getFinalY(n){
		var finalY = finalPos[3*n+1];
		return finalY;
	}
	
	function getFinalZ(n){
		var finalZ = finalPos[3*n+2];
		return finalZ;
	}
	
	
	function getCurrentX(n){
		var currentX = randomPosArray[3*n];
		return currentX;
	}
	
	function getCurrentY(n){
		var currentY = randomPosArray[3*n+1];
		return currentY;
	}
	
	function getCurrentZ(n){
		var currentZ = randomPosArray[3*n+2];
		return currentZ;
	}
	
	
	function getDistance(n){
		fX = getFinalX(n);
		fY = getFinalY(n);
		fZ = getFinalZ(n);
		
		cX = getCurrentX(n);
		cY = getCurrentY(n);
		cZ = getCurrentZ(n);
		
		var dist = Math.sqrt(Math.pow(fX-cX)+Math.pow(fY-cY)+Math.pow(fZ-cZ));
		
		return dist;
	}
	
	
	
	
	
	function immediateFinal(object, n){
		object.position.x = getFinalX(n);
		object.position.y = getFinalY(n);
		object.position.z = getFinalZ(n);
		
		
		render();
	}
	
	
	
	
	
	function tryRotation(object){
		var radius;
		var parent;
		var pivot;
		var dist;
	
		dist = getDistance(x);
		radius = dist/2; 	
		
		parent = new THREE.Object3D();
		scene.add(parent);
		
		pivot = new THREE.Object3D();
		pivot.rotation.z = radius;
		parent.add(pivot);
		
		pivot.add(cubeArray[x]);
		
		animate();
			
	}
	
	function animate(){
		requestAnimationFrame( animate );

		parent.rotation.z += 0.01;
		
		render();

	}
	
	
	/*$(window).click(function(){
		var cube1 = gameGrid[0];
		TweenMax.to(cube1, 5, {opacity: 0});
		//createSpline();
		
		for(var x=0; x<cubeArray.length; x++){
			
			immediateFinal(cubeArray[x], x);
			
			//tryRotation(cubeArray[x]);
		}
	});*/
	
	
	
});

