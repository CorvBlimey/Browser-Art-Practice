// This is for holding misc. helper functions to make main_canvas more legible.
// Basically, if it's in here, I'd otherwise put it in a utility library.

// Given just two points in split-out form (see args), find their distance.
function getDistanceBetweenPoints(x1, y1, x2, y2){return Math.sqrt((x1-x2)**2 + (y1-y2)**2);}

// Given a list of absolute coords, find the distance from one to the next.
function getDistanceBetweenCoords(coordinate_list){
  var distances = [];
  var x1 = coordinate_list[0][0];
  var y1 = coordinate_list[0][1];
  for(var i=1; i<coordinate_list.length; i++){
    var x2 = coordinate_list[i][0];
    var y2 = coordinate_list[i][1];
    distances.push(getDistanceBetweenPoints(x1, y1, x2, y2));
    x1 = x2;
    y1 = y2;
  }
  return distances;
}

// Given a list of absolute coords, find how long the final path is.
function getLengthOfCoordPath(coords_list){
  var dist_list = getDistanceBetweenCoords(coords_list);
  // My kingdom for a list comprehension.
  var total_distance = 0;
  for(var i=0; i < dist_list.length; i++){
    total_distance += dist_list[i];
  }
  return total_distance;
}

// Canvas text wrap for long descriptions: https://stackoverflow.com/questions/57403688/how-can-i-implement-word-wrap-and-carriage-returns-in-canvas-filltext
function wrapText (c, text, x, y, maxWidth, lineHeight) {

    var words = text.split(' ');
    var line = '';
    var lineCount = 0;
    var test;
    var metrics;

    for (var i = 0; i < words.length; i++) {
        test = words[i];
// add test for length of text
        metrics = c.measureText(test);
        while (metrics.width > maxWidth) {
            test = test.substring(0, test.length - 1);
            metrics = c.measureText(test);
        }

        if (words[i] != test) {
            words.splice(i + 1, 0,  words[i].substr(test.length));
            words[i] = test;
        }

        test = line + words[i] + ' ';
        metrics = c.measureText(test);

        if (metrics.width > maxWidth && i > 0) {
            c.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
            lineCount++;
        }
        else {
            line = test;
        }
    }

    c.fillText(line, x, y);
}
