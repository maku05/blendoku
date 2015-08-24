// place the gameGrid into the scene
function placeGameGrid() {
  // setting the basics for the gridcubes
  var gridGeo, gridMat, dragMat;
  gridGeo = new THREE.BoxGeometry(10, 10, 10);
  var j = 1; // counter which controls that only 10 cubes are gonna go in one row
  var line = 1; // used to achive the visualization of the cubes in rows of 10 cubes
  var startX = 50; // to push it a bit aside the menu a small startX is needed
  // the grid counts 100 cubes
  for (var i = 1; i <= 100; i++) {
    if (j == 11) {
      line++;
      j = 1;
    }
    for (var z = 0; z < startGridArray.length; z++) {
      if (startGridArray[z].id == i) {
        gridMat = new THREE.MeshBasicMaterial({
        map: cubeTexture,
          color: startGridArray[z].color,
        });
        gameGrid[i] = new THREE.Mesh(gridGeo, gridMat);
        gameGrid[i].id = 2000 + startGridArray[z].id;
        gameGrid[i].position.x = startX + (j * 7 - ((11 - j) * 7)); // depanding on the count of the cubes they are placed in the middle of the scene
        gameGrid[i].position.y = ignitionY - line * 15; // space between the lines achived by calculating in which line the algorithm is an adding space of 15 between the rows
        gameGrid[i].startPositionX = startX + (j * 7 - ((11 - j) * 7)); //  save start position for reset after dragging failed
        gameGrid[i].startPositionY = line * 15; //  save start position for reset after dragging failed
        gameGrid[i].startPositionZ = gameGrid[i].position.z; //  save start position for reset after dragging failed  
        gameGrid[i].active = false;
        gameGrid[i].editable = startGridArray[z].edit; //  string to boolean
        gameGrid[i].color = gameGrid[i].material.color.getHexString();
        gameGridGroup.add(gameGrid[i]); // add created cube to game grid
      }
    }
    j++; // upcount the cubes in current line
  }
   j = 0;
  line = 1; // reset the line to one because now we need to create the colors which are used in the level. seting line to 1 gives us a little space between grid an used colors
  // count of used colors is set by the levelconfiguration	
  for (var i = 0; i < colorArray.length; i++) {
    dragMat = new THREE.MeshBasicMaterial({
      map: cubeTexture,
      color: colorArray[i]
    });
    dragingCubes[i] = new THREE.Mesh(gridGeo, dragMat);

    // same as for the gamegrid
    if (j == 10) {
      line++;
      j = 0;
    }
    dragingCubes[i].position.x = (j * 7 - ((10 - j) * 7));
    dragingCubes[i].position.y = ignitionDragY + line * 15; //  line are bild up in positiv y-direction
    dragingCubes[i].id = 1000 + i;
    dragingCubes[i].startPositionX = (j * 7 - ((10 - j) * 7)); //  save start position for reset after dragging failed
    dragingCubes[i].startPositionY = line * 15; //  save start position for reset after dragging failed  
    dragingCubes[i].startPositionZ = 0; //  save start position for reset after dragging failed  
    dragingCubes[i].color = dragingCubes[i].material.color.getHexString(); //  set color attribute for easier request  
    dragingCubes[i].startColor = dragingCubes[i].color; // save color at the beginning for reset
    dragingCubes[i].active = true;
    dragingCubes[i].editable = true;
    j++;
    draggingCubesGroup.add(dragingCubes[i]); // add created cube to grid group
  }

  //modify position and rotation of grid groups
  draggingCubesGroup.rotation.x = -10 * Math.PI / 180;
  draggingCubesGroup.rotation.y = -10 * Math.PI / 180;
  draggingCubesGroup.position.x = 75;
  draggingCubesGroup.position.y = 50;
  gameGridGroup.position.z = -20;
  gameGridGroup.rotation.x = -10 * Math.PI / 180;
  gameGridGroup.rotation.y = -10 * Math.PI / 180;
  
  //add grid groups to scene
  scene.add(draggingCubesGroup);
  scene.add(gameGridGroup);
}

// animates the moving in of the gamegrid an used colors into the scene
function startGrid() {
  //console.log(gameGridGroup.children[0].position.y);
  pos = gameGridGroup.children[0].position.y;
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

//delete current grid form scene
function eraseGrid() {
  scene.remove(gameGridGroup);
  scene.remove(draggingCubesGroup);
  gameGridGroup.children.length = 0;
  draggingCubesGroup.children.length = 0;
  
  //reset all arrays with game elements
  gameGrid.length = 0;
  dragingCubes.length = 0;
  startGridArray.length = 0;
  colorArray.length = 0;
}

//get fresh level JSON and replace current game grid
function resetGrid() {
  eraseGrid();
  readJson(level["id"]);
  placeGameGrid();
  startGrid();
}

//get next level grid
function nextGrid() {
  eraseGrid();
  readJson(level["id"]);
  placeGameGrid();
}