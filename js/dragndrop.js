// events for right click
function onDocumentOnContextMenu(event) {
  if (event.which == 3) {
    event.preventDefault(); // stop default mose events
    
    //get mouse vector
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0);
    //unprojecting 2D points into the 3D world
    projector.unprojectVector(vector, camera);

    //create raycaster and check if element of game grid is intersected by the raycaster
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(gameGridGroup.children);

    if (intersects.length > 0) { // in case of game grid elments are intersected
      var lsgElement = intersects[0].object;
      if (lsgElement.active == true) {
        //searching in start color cubes for cube with the start color, which is color of the current selected element 
        for (var i = 0; i < draggingCubesGroup.children.length; i++) {
          var object = scene.getObjectById(1000 + i, true);
          if (object.startColor == lsgElement.color) {
            //reset material color of the color cube to start color and set status to active
            object.color = object.startColor;
            object.material.color.setHex("0x" + object.color);
            object.active = true;
          }
        }
        // reset color and active status of element
        lsgElement.active = false;
        lsgElement.color = defaultColor;
        lsgElement.material.color.setStyle(defaultColor);
      }
    }
  }
  SELECTED = null; // set global variable for selected(dragged) object
}

// modify camera aspect in case of window will be resizes by user
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// events for moving mouse
function onDocumentMouseMove(event) {
  event.preventDefault();  // stop default mose events
  // track mouse moves
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  //unprojecting 2D points into the 3D world
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  projector.unprojectVector(vector, camera);

  //create raycaster and check if element of game grid is intersected by the raycaster
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  // in case of an element is selected(dragging) synchronise object position with mouse position
  if (SELECTED) {
    var intersects = raycaster.intersectObject(plane);
    SELECTED.position.copy(intersects[0].point.sub(offset));
    return;
  }

  //create different raycaster for different grid groupes
  var intersectDraggingCubes = raycaster.intersectObjects(draggingCubesGroup.children);
  var intersectGameGrid = raycaster.intersectObjects(gameGridGroup.children);

  //check intersected objects and change pointer icon if is necessary
  if (intersectDraggingCubes.length > 0) {
    if (INTERSECTED != intersectDraggingCubes[0].object) {
      INTERSECTED = intersectDraggingCubes[0].object;
      plane.position.copy(INTERSECTED.position);
      plane.lookAt(camera.position);
    }
    document.getElementById("webGLContainer").style.cursor = 'pointer';
  } else {
    document.getElementById("webGLContainer").style.cursor = 'auto';
  }
  
  //check intersected objects and change pointer icon if is necessary
  if (intersectGameGrid.length > 0) {
    if (INTERSECTED != intersectGameGrid[0].object) {
      INTERSECTED = intersectGameGrid[0].object;
      plane.position.copy(INTERSECTED.position);
      plane.lookAt(camera.position);
    }
    document.getElementById("webGLContainer").style.cursor = 'pointer';
  } else {
    document.getElementById("webGLContainer").style.cursor = 'auto';
  }
}

// events for mouse down
function onDocumentMouseDown(event) {
	
   if(status == "wait"){
	   if (event.which == 1) {
		 event.preventDefault();
		 //get mouse vector
		 var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
		  //unprojecting 2D points into the 3D world
		 projector.unprojectVector(vector, camera);
	
		 //create raycaster and check if element of game grid  or color grid is intersected by the raycaster
		 var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
		 var intersectDraggingCubes = raycaster.intersectObjects(draggingCubesGroup.children);
		 var intersectGameGrid = raycaster.intersectObjects(gameGridGroup.children);
	
		 if (intersectDraggingCubes.length > 0) {
		   var intersects = intersectDraggingCubes;
		 } else if (intersectGameGrid.length > 0) {
		   var intersects = intersectGameGrid;
		 }
		
		// check if intersected element is active and editable --> set global SELECTED 
		 if (intersects[0].object.active == true && intersects[0].object.editable == true) {
		   SELECTED = intersects[0].object;
		   offset.copy(intersects[0].point).sub(plane.position);
		   document.getElementById("webGLContainer").style.cursor = 'move';
		 } else {
		   document.getElementById("webGLContainer").style.cursor = 'crosshair';
		 }
	   }
   }
 }

// events for mouse down
function onDocumentMouseUp(event) {
  if (event.which == 1) {
    event.preventDefault();
     //get mouse vector
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    //unprojecting 2D points into the 3D world
    projector.unprojectVector(vector, camera);

    //create raycaster and check if element of game grid
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(gameGridGroup.children);

    if (INTERSECTED && SELECTED) {
      // check if selected object is from color grid
      if (SELECTED.id < 2000) {
        if (intersects.length < 1) {
          SELECTED.position.set(SELECTED.startPositionX, SELECTED.startPositionY, SELECTED.startPositionZ)
          SELECTED = null;
        }
        var lsgElement = Object();
        lsgElement = intersects[0].object;
        // in case of intersected element is editable -> set new color and reset old to color grid
        if (intersects.length > 0 && lsgElement.editable == true) {
          if (lsgElement.active == true) {
            for (var i = 0; i < draggingCubesGroup.children.length; i++) {
              var object = scene.getObjectById(1000 + i, true);
              if (object.startColor == lsgElement.color) {
                object.color = object.startColor;
                object.material.color.setHex("0x" + object.color);
                object.active = true;
              }
            }
          }
          lsgElement.active = true;
          lsgElement.color = SELECTED.color;
          lsgElement.material.color.setHex("0x" + lsgElement.color);
          SELECTED.active = false;
          SELECTED.color = SELECTED.defaultColor;
          SELECTED.material.color.setHex(SELECTED.defaulColor);
        }
      }
      //in case of selected element is from game grid
      if (SELECTED.id >= 2000) {
        if (intersects.length > 1) {
          var intersectedObject = Object();
          intersectedObject = intersects[0].object;
          var selectedObject = Object();
          selectedObject = intersects[1].object;

          if (selectedObject.editable == true && intersectedObject.editable == true) {
            var intersectedColor = intersectedObject.material.color.getHex();
            var selectedColor = selectedObject.material.color.getHex();
            // swap color of the elements
            selectedObject.material.color.setHex(intersectedColor);
            intersectedObject.material.color.setHex(selectedColor);
            selectedObject.color = selectedObject.material.color.getHexString();
            intersectedObject.color = intersectedObject.material.color.getHexString();
            selectedObject.active = true;
            intersectedObject.active = true;
          }
        }
      }
    }
    plane.position.copy(INTERSECTED.position);
    // reset selected element to start position
    SELECTED.position.set(SELECTED.startPositionX, SELECTED.startPositionY, SELECTED.startPositionZ)
    SELECTED = null;
    document.getElementById("webGLContainer").style.cursor = 'auto';
  }
}