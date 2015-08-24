var score;
// send post of solution JSON to API
function sendSolutionJSON(json) {
      var solved;
      
      var solutionJSON = json;

      $.ajax({
            type: "POST",
            async: false,
            url: "http://api.blendoku.verbunden.net/v1/level/solves/" + level["id"] + ".json",
            headers: {
                  'accesstoken': user["accesstoken"],
                  'name': user["name"]
            },
            data: solutionJSON,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                  solved = data.solved;
                  score = data.score;
            },
            failure: function(errMsg) {
                  alert(errMsg);
            }
      });
      solutionCheck(solved);
}

// check if solution is right or not and give response
function solutionCheck(solved) {
      if (solved == true) {
            // in case of right solution
            alert("Richtig! Du hast " + score + " Punkte gesammelt! Mach doch gleich weiter mit einem anderen Level?"); //response
            status = "comeBack";
            if (direction == 1) {
                  direction = -1;
            } else {
                  direction = 1;
            }
            // animate menu fade out
            resetMobileNav();
            $('.back.open').removeClass('open');
            $('#left.open').removeClass('open');
            $('.tutorialGUI').removeClass('open');
            $('.difficultySelection').removeClass('open');
            $('.allLevels').removeClass('open');
            $('#left .finish').css('display', 'block');
            $('#left .score').css('display', 'block');
            $('#foreground').animate({
                  left: "0"
            }, 1);
            $('#foreground').animate({
                  opacity: "1"
            }, 1500);
            $('.highscoreContainer').removeClass('open');
      } else {
            // in case of false solution
            alert("Leider ist deine Lösung nicht richtig! Probiere es weiter..."); // response
      }
}

// get values of solution elements and create JSON
function getSolutionJSON() {
      var i = 0;
      var solutionJSON = '{';
      solutionJSON += '"user":{"name":"' + user["name"] + '","accesstoken":"' + user["accesstoken"] + '"},'; // add user data to JSON
      solutionJSON += '"grid":{';
      for (i = 0; i < gameGridGroup.children.length - 1; i++) {
            solutionJSON += '"' + (gameGridGroup.children[i].id - 2000).toString() + '":"#' + gameGridGroup.children[i].color + '",'; // get id and color value
      }
      solutionJSON += '"' + (gameGridGroup.children[i].id - 2000).toString() + '":"#' + gameGridGroup.children[i].color + '"}';
      solutionJSON += ',"complexity":"' + level["complexity"] + '","starttime":"' + level["starttime"] + '"}';
      return solutionJSON;
}

// get level JSON from API and fill global arrays
function readJson(levelid) {
      level["id"] = levelid;
      jsonURL = "http://api.blendoku.verbunden.net/v1/level/starts/" + levelid.toString() + ".json";
      var i = 0;

      $.ajax({
            url: jsonURL,
            dataType: 'json',
            // add user data to header of JSON file
            headers: {
                  'accesstoken': user["accesstoken"],
                  'name': user["name"]
            },
            async: false,
            success: function(data) {
                  // read color values and fill global array
                  $.each(data.level.color, function(key, val) {
                        colorArray.push(val.toString());
                  });
                  // read game grid values and fill global array
                  $.each(data.level.startgrid, function(key, val) {
                        startGridArray.push(val);
                        startGridArray[i].id = parseInt(key);
                        startGridArray[i].editable = val.edit;
                        i++;
                  });
                  // read user data and fill global user array
                  level["id"] = data.level.id;
                  level["complexity"] = data.level.complexity;
                  level["starttime"] = data.starttime;
            }
      });
      shuffle(colorArray); //randomize positions in color array
}

//shuffle the color array to randomize the positions of color cubes in the game grid
function shuffle(array) {
      var currentIndex = array.length,
          temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
      }
      return array;
}