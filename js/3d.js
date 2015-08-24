// JavaScript Document
var container;
var camera, controls, scene, projector, renderer;
var plane;

var defaultColor = "#ffffff";

var mouse = new THREE.Vector2(),
		offset = new THREE.Vector3();

//global constant for interseceted Object and selected Object (for drag and drop)
var INTERSECTED, SELECTED;
var level = {
	"id" : "1",
	"complexity" : "",
	"starttime" : "",
	};
var starttime;
var user = { 
	"name":"",
	"accesstoken":"",
}

var jsonURL;

/* stuff for gamegrid */
var gameGrid = []; // array of the grid of gamecourt
var dragingCubes = []; // array of the used colors in the level
var startGridY = 0; // where the top left cube of the gamecourt needs to be at gamestart
var startDragY = 75; // where the bottom left of the used colors needs to be at gamestart
var ignitionY = -630; // y of gameGrid before the start animation
var ignitionDragY = 680; // y of the used colors before the start animation
var gameGridGroup = new THREE.Object3D(); // group all objects of the game-grid
var draggingCubesGroup = new THREE.Object3D(); // group all objects of the draggable-colors-grid
var colorArray = []; //	all draggable colors are put into this
var startGridArray = []; // all cubes that build up the game-grid are put into this
var cubeTexture = new THREE.ImageUtils.loadTexture('img/texture.jpg'); // texture for the cubes in grid

//global vars
var count = 17; // count of colors used for this level, only needed for development
var status = "normal"; // set the status of the current animation/rendering
var cubeCount = 150; // count of cubes in rotation-cluster
var direction = 1;
var cubeArray = []; // set up the array for the cubes
var parent = []; // set up the array for the rotation around a certain spot
var xMax, xMin, yMax, yMin;

// start animation to start positions
var anker; // needed to detect when cubes arrive back at their starting position when moving back
var display;

$(document).ready(function() {
	
		$('.menu .highscore').click(function(){
	showHighscore();
});

function showHighscore(){
	var highscoreArray = [];
	var highscorediv;
	var i = 0;
	
	$.each($('.highscoreDiv'), function(){
		$(this).remove();
	});
	
	$.ajax({
		url: "http://api.blendoku.verbunden.net/v1/stats/highscore",
		dataType: 'json',
		async: false,
		success: function(data){
			console.log(JSON.stringify(data));
			$.each(data, function (key,val){
				i++
				highscoreLi = '<div class="highscoreDiv">'+i+'. '+val.name+'<br>'+val.user_score+' Punkte</div>';
				$('.highscoreContainer').append(highscoreLi);
			});
			
			i = 0;	
		}
	});
}
	
	init();

	function init() {
		var display = $('#webGLContainer'); // set the div in which the webGL is running
		// getting the extrema of scene
		xMax = display.width()/2;
		xMin = -display.width()/2;
		//yMax = display.height() / 2;
		//yMin = -display.height() / 2;

		//create the cam
		cameraSettings();

		projector = new THREE.Projector();

		scene = new THREE.Scene(); // create the scene

		//create and add background plane
		createPlane();

		// create the renderer
		rendrerSettings();
		display.append(renderer.domElement);

		//lights settings
		spotOn();

		//add eventListener
		renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
		renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
		renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
		renderer.domElement.addEventListener('contextmenu', onDocumentOnContextMenu, false);
		window.addEventListener('resize', onWindowResize, false);

		//create random cubes
		randomCubes();

		placeGameGrid(); // put the gamegrid into the scene (not visible since its outside the area which is captured by the cam)
		scene.add(gameGridGroup); // add the game-grid-group to the scene
		scene.add(draggingCubesGroup);
		
		render();
	}

	function rendrerSettings() {
		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.sortObjects = false;
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;
	}

	function cameraSettings() {
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 500;
		camera.position.y = 0;
		camera.position.x = 0;
	}

	function spotOn() {
		var light = new THREE.SpotLight(0xffffff, 1.5);
		light.position.set(0, 500, 2000);
		light.castShadow = true;

		light.shadowCameraNear = 200;
		light.shadowCameraFar = camera.far;
		light.shadowCameraFov = 50;

		light.shadowBias = -0.00022;
		light.shadowDarkness = 0.5;

		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;

		scene.add(light);

		var light2 = new THREE.SpotLight(0xffffff, 0.75);
		light2.position.set(500, -500, 0);
		light2.castShadow = true;

		light2.shadowCameraNear = 200;
		light2.shadowCameraFar = camera.far;
		light2.shadowCameraFov = 50;

		light2.shadowBias = -0.00022;
		light2.shadowDarkness = 0.5;

		light2.shadowMapWidth = 2048;
		light2.shadowMapHeight = 2048;
		scene.add(light2);
	}

	function randomCubes() {
		// create the objects
		var geometry = new THREE.BoxGeometry(10, 10, 10); // set size of the boxes
		var material; // init the material var
		for (var i = 0; i < cubeCount; i++) { // creating a number of cubes
			material = new THREE.MeshLambertMaterial({
				color: Math.random() * 0xffffff,
				transparent: true,
				opacity: 1
			}); // randomly choose the color
			cubeArray[i] = new THREE.Mesh(geometry, material); // mesh material and geometry to get the object -> put it in the cube-array
			randomPosition(cubeArray[i]); // use method below to positon the cube randomly in the scene
			scene.add(cubeArray[i]); // add the cube to the scene
			// Objekte für Orbitalrotation
			parent[i] = new THREE.Object3D(); // create the rotation-cosmos
			scene.add(parent[i]);

			randomPosition(parent[i]); // place the rotation-cosmos randomly in the scene
			parent[i].add(cubeArray[i]); // add a cube to the rotation-cosmos
		}
	}

	function createPlane() {
		plane = new THREE.Mesh(new THREE.PlaneGeometry(5000, 1000, 8, 8), new THREE.MeshBasicMaterial({
			color: 0x000000,
			opacity: 0.00,
			transparent: true,
			wireframe: true
		}));
		plane.visible = false;
		scene.add(plane);
	}

	function render() {
		//console.log(cubeArray[0].position.x);
		//console.log(status);
		if (status == "normal") {
			rotate(); // add the rotation on a cube (around itself)
			if (direction == 1) {
				parentRotate(); // do the rotation of the rotation-cosmos
			} else {
				negativeParentRotate(); // do a negative orbital-rotation in order to get the cubes to the places where they originally came from
			}
			requestAnimationFrame(render); // needed for continous animation/transition
			renderer.render(scene, camera); // render the scene
		} else if (status == "goAway") {
			checkWait(); // check if cube1 is outside of the scene-extrema
			move(); // push all cubes softly further away to fly outside of the scene
			fadeOut(); // fade the cubes out while they're moved outside of the scene
			startGrid(); // animate the appearance of the gamegrid
			if (status == "wait") {
				console.log("first time get in status wait");
				for (var i = 0; i < colorArray.length; i++) {
				dragingCubes[i].startPositionY = dragingCubes[i].position.y;
				dragingCubes[i].startPositionX = dragingCubes[i].position.x;
				}
				for (var i = 0; i < gameGridGroup.children.length; i++) {
					gameGridGroup.children[i].startPositionY = gameGridGroup.children[i].position.y;
					gameGridGroup.children[i].startPositionX = gameGridGroup.children[i].position.x;
				}
			}
			if (direction > 0) {
				parentRotate(); // do the rotation of the rotation-cosmos
			}
			if (direction < 0) {
				negativeParentRotate(); // do a negative orbital-rotation in order to get the cubes to the places where they originally came from
			}
			zoomIn(); // zoom the camera closer to the scene
			requestAnimationFrame(render); // needed for continous animation/transition
			renderer.render(scene, camera); // render the scene
		} else if (status == "comeBack") {
			checkStatus(); // check if cube1 has reached it's original place from which it was pushed outside of the scene or where it had the "normal" animation
			moveBack(); // move all cubes back into the scene
			fadeIn(); // let the cubes fade back in while they are pushed back into the scene
			exitGrid(); // animate the disappearance of the gamegrid
			if (direction > 0) {
				parentRotate(); // do the rotation of the rotation-cosmos
			}
			if (direction < 0) {
				negativeParentRotate(); // do a negative orbital-rotation in order to get the cubes to the places where they originally came from
			}
			zoomOut(); // zoom away from the scene
			requestAnimationFrame(render); // needed for continous animation/transition
			renderer.render(scene, camera); // render the scene
		}
		// status in which the player interacts with the whole scene -> drags the colors to their needed position in the grid
		else if (status == "wait") {
			requestAnimationFrame(render); // needed for continous animation/transition
			renderer.render(scene, camera); // render the scene
		}
	}
	
	$('.menu .start').click(function(){	
		if(status == "normal"){
			//prepareGame();
			resetGrid();

			anker = cubeArray[0].position.x; // doesn't metter which cubes' x-position is used since all of them move with the same speed
			status = "goAway";
		}
	});
		
	// rotation of the cube arround itself
	function rotate(){
		for(var i=0; i<cubeCount; i++){   
			if(i % 3 == 0){
				cubeArray[i].rotation.x -= 0.01;	
			}
			if(i % 3 == 1){
				cubeArray[i].rotation.y -= 0.01;
			}
			else{
				cubeArray[i].rotation.z -= 0.01;	
			}
		}
	}

	// rotation of the rotation-cosmos
	function parentRotate(){
		for(var i=0; i<(parent.length); i++){
			if(i % 3 == 0){
				parent[i].rotation.z += 0.025;
			}
			else if(i%3 == 1){
				parent[i].rotation.x -= 0.025;		
			}
			else{
				parent[i].rotation.y -= 0.025;	
			}
		}
	}
	
	// exact opposite of parentRotate() in order to reach the exact same spot the cubes originally had
	function negativeParentRotate(){
		for(var i=0; i<(parent.length); i++){
			if(i % 3 == 0){
				parent[i].rotation.z -= 0.025;
			}
			else if(i%3 == 1){
				parent[i].rotation.x += 0.025;		
			}
			else{
				parent[i].rotation.y += 0.025;	
			}
		}
	}
	
	// move the cubes outside of the scene
	function move(){
		for(var i=0; i<cubeCount; i++){   
			// for the ones that have an orbital-rotation around the z-axis
			if(i % 3 == 0){
				cubeArray[i].position.x += 7;	
			}
			// for the ones that have an orbital-rotation around the x-axis
			if(i % 3 == 1){
				cubeArray[i].position.y += 7;
			}
			// for the ones that have an orbital-rotation around the y-axis
			else{
				cubeArray[i].position.z += 7;	
			}
		}
	}
	
	// move the cubes back to their original position when they where in "normal" animation
	function moveBack(){
		for(var i=0; i<cubeCount; i++){   
			// for the ones that have an orbital-rotation around the z-axis
			if(i % 3 == 0){
				cubeArray[i].position.x -= 7;	
			}
			// for the ones that have an orbital-rotation around the x-axis
			if(i % 3 == 1){
				cubeArray[i].position.y -= 7;
			}
			// for the ones that have an orbital-rotation around the y-axis
			else{
				cubeArray[i].position.z -= 7;	
			}
		}
	}
	
	
	// make the angle of the camera smaller and it's distance wider -> due to controlling problems with drag and drop on wider angle
	function zoomIn(){
		if(camera.fov > 10){
			camera.fov -= 1;
			camera.updateProjectionMatrix();
		}
        if(camera.position.z < 1200){
			camera.position.z += 10;
            camera.lookAt(new THREE.Vector3(0,0,0));
			camera.updateProjectionMatrix();
		}

	}
	
	// make the angle of the camera wider and it's distance smaller
	function zoomOut(){
		if(camera.fov < 45){
			camera.fov += 1;
			camera.updateProjectionMatrix();
		}
        // reverse the repositioning made in the zoomIn()-method
        if(camera.position.z > 500){
			camera.position.z -= 7;
            camera.lookAt(new THREE.Vector3(0,0,0));
           camera.updateProjectionMatrix();
		} 


	}
	
	// make the opacity of the cubematerial go from 1 to 0
	function fadeOut(){
		if(cubeArray[0].material.opacity > 0){
			for(var i=0; i<cubeArray.length; i++){
				cubeArray[i].material.opacity -= 0.01; 
			}
		}
	}
	
	// make the opacity of the cubematerial go from 0 to 1
	function fadeIn(){
		if(cubeArray[0].material.opacity < 1){
			for(var i=0; i<cubeArray.length; i++){
				cubeArray[i].material.opacity += 0.01; 
			}
		}
	}

	// checks if the original position is reached by cube 1
	function checkStatus() {
		if (cubeArray[0].position.x <= anker) {
			status = "normal"
		}
	}

	// checks if cube1 is outside of the scene
	function checkWait() {
		if ( (cubeArray[0].position.x > xMax) || (cubeArray[0].position.x < xMin)) {
			status = "wait";
		}
	}
	

	// place object randomly in the scene
	function randomPosition(object) {
		var range = 400; // in which scale the cubes are gonna spread over the scene. bigger range -> wider spread
		object.position.x = (Math.random() - 0.5) * (Math.random() * range);
		object.position.y = (Math.random() - 0.5) * (Math.random() * range);
		object.position.z = (Math.random() - 0.5) * (Math.random() * range);
	}
});