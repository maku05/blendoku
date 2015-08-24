// rotation of the cube arround itself

	function rotate() {
		for (var i = 0; i < cubeCount; i++) {
			if (i % 3 == 0) {
				cubeArray[i].rotation.x -= 0.01;
			}

			if (i % 3 == 1) {
				cubeArray[i].rotation.y -= 0.01;
			} else {
				cubeArray[i].rotation.z -= 0.01;
			}
		}
	}

	// rotation of the rotation-cosmos

	function parentRotate() {
		for (var i = 0; i < (parent.length); i++) {
			if (i % 3 == 0) {
				parent[i].rotation.z += 0.025;
			} else if (i % 3 == 1) {
				parent[i].rotation.x -= 0.025;
			} else {
				parent[i].rotation.y -= 0.025;
			}
		}
	}

	// exact opposite of parentRotate() in order to reach the exact same spot the cubes originally had

	function negativeParentRotate() {
		for (var i = 0; i < (parent.length); i++) {
			if (i % 3 == 0) {
				parent[i].rotation.z -= 0.025;
			} else if (i % 3 == 1) {
				parent[i].rotation.x += 0.025;
			} else {
				parent[i].rotation.y += 0.025;
			}
		}
	}

	// move the cubes outside of the scene

	function move() {
		for (var i = 0; i < cubeCount; i++) {
			// for the ones that have an orbital-rotation around the z-axis
			if (i % 3 == 0) {
				cubeArray[i].position.x += 7;
			}
			// for the ones that have an orbital-rotation around the x-axis
			if (i % 3 == 1) {
				cubeArray[i].position.y += 7;
			}
			// for the ones that have an orbital-rotation around the y-axis
			else {
				cubeArray[i].position.z += 7;
			}
		}
	}

	// move the cubes back to their original position when they where in "normal" animation

	function moveBack() {
		for (var i = 0; i < cubeCount; i++) {
			// for the ones that have an orbital-rotation around the z-axis
			if (i % 3 == 0) {
				cubeArray[i].position.x -= 7;
			}
			// for the ones that have an orbital-rotation around the x-axis
			if (i % 3 == 1) {
				cubeArray[i].position.y -= 7;
			}
			// for the ones that have an orbital-rotation around the y-axis
			else {
				cubeArray[i].position.z -= 7;
			}
		}
	}


	// make the angle of the camera smaller and it's distance wider -> due to controlling problems with drag and drop on wider angle

	function zoomIn() {
		if (camera.fov > 10) {
			camera.fov -= 1;
			camera.updateProjectionMatrix();
		}
		// repositioning of the camera in order to capture the whole grid after the frustum was lowered
/*if(camera.position.x < 140){
						camera.position.x += 10;
						camera.lookAt(new THREE.Vector3(0,0,0));    // reset the LookAtPoint of the camera since its position has been changed
						camera.updateProjectionMatrix();            // update the ProjectionMatrix to append the new settings
				}
				if(camera.position.y > -450){
						camera.position.y -= 10;
						camera.lookAt(new THREE.Vector3(0,0,0));
						camera.updateProjectionMatrix();
				}*/
		if (camera.position.z < 1200) {
			camera.position.z += 10;
			camera.lookAt(new THREE.Vector3(0, 0, 0));
			camera.updateProjectionMatrix();
		}

	}

	// make the angle of the camera wider and it's distance smaller

	function zoomOut() {
		if (camera.fov < 45) {
			camera.fov += 1;
			camera.updateProjectionMatrix();
		}

		// reverse the repositioning made in the zoomIn()-method
/*if(camera.position.x > 0){
						camera.position.x -= 10;
						camera.lookAt(new THREE.Vector3(0,0,0));
						camera.updateProjectionMatrix();
				}
				if(camera.position.y < 0){
						camera.position.y += 10;
						camera.lookAt(new THREE.Vector3(0,0,0));
						camera.updateProjectionMatrix();
				}*/
		if (camera.position.z > 500) {
			camera.position.z -= 7;
			camera.lookAt(new THREE.Vector3(0, 0, 0));
			camera.updateProjectionMatrix();
		}


	}

	// make the opacity of the cubematerial go from 1 to 0

	function fadeOut() {
		if (cubeArray[0].material.opacity > 0) {
			for (var i = 0; i < cubeArray.length; i++) {
				cubeArray[i].material.opacity -= 0.01;
			}
		}
	}

	// make the opacity of the cubematerial go from 0 to 1

	function fadeIn() {
		if (cubeArray[0].material.opacity < 1) {
			for (var i = 0; i < cubeArray.length; i++) {
				cubeArray[i].material.opacity += 0.01;
			}
		}
	}
  
  	// animates the moving in of the gamegrid an used colors into the scene
  
  function startGrid() {

		var pos = gameGridGroup.children[0].position.y;
		if (pos < startGridY) {
			for (var i = 0; i < gameGridGroup.children.length; i++) {
				gameGridGroup.children[i].position.y += 7;
			}
			for (var i = 0; i < dragingCubes.length; i++) {
				dragingCubes[i].position.y -= 7;
			}
		}
	}

	// animates the moving out of the gamegrid an used colors out of the scene

	function exitGrid() {

		if (gameGridGroup.children[0].position.y > ignitionY) {
			for (var i = 0; i < gameGridGroup.children.length; i++) {
				gameGridGroup.children[i].position.y -= 7;
			}
			for (var i = 0; i < dragingCubes.length; i++) {
				dragingCubes[i].position.y += 7;
			}
		}
	}