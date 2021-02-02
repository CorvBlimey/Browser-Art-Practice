// This is the main "game screen"/spaghetti warehouse for the program.
var canvas = document.createElement('canvas');
document.getElementById("canvas_div").appendChild(canvas);
canvas.style.background = '#272127';  // I use desaturated purples for...reasons?
var ctx = canvas.getContext('2d');
canvas.style.margin = "auto";
canvas.style.display = "block";
var teacher_line_width = 5;
var student_line_width = 3;
ctx.lineCap = 'round';
var small_font = "1vw Monospace";
var big_font = "2vw Monospace";
var light_ink = "#FFF4EC";
var dark_ink = "#66FF66"; //"#CFB47C";
var exercise_text = {
  "GLORIOUS!": ["That was amazing!", "You knocked it out of the park!", "Fantastic work!", "You're killing it!",
                "Absolutely stunning!", "GLORIOUS!"],
  "Great!": ["Awesome job!", "That was great!", "Keep it up!", "Great!", "Keep up the great work!", "Wonderful!", "Excellent job!"],
  "Good": ["You're doing good!", "Keep it up!", "Looking good!", "Good!", "You're getting it!", "Solid!"],
  "Fair": ["Solid work!", "You're putting in the effort!", "You're improving!", "Onwards and upwards!", "Keep at it!"],
  "miss": ["Keep at it!", "You can do it!", "Don't sweat it!", "Let's go!"]};
ctx.strokeStyle = dark_ink;
ctx.fillStyle = light_ink;
var pos = { x: 0, y: 0 };
var score = 0;
// plain Javascript's Enum equivalent does allow for "wrong" values, oh well
CanvasMode = Object.freeze({"startExercise":1,
                            "doExercise":2,
                            "finishExercise":3,
                            "done":4});
var current_canvas_mode = CanvasMode.startExercise;
var exercise = setExerciseDefaults(chooseRandomExercise());  // only random mode for now
var exercise_step = 0;
var exercise_step_coords = [];  // Coords for the current step of the exercise
var student_coords = [];
var exercise_points = 0;
var exercise_possible_points = 0;
var student_start_time = 0;
var student_end_time = 0;
resize();  // the left side of the screen is the canvas, the right is scoring/progress
resize();  // TODO: HTML gets funky if we don't do it twice. HTML is a mystery.

// My only touch device fires mouse events.
// There may be more compatability work to do here, but I'll need test volunteers
window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', processMouseMove);
canvas.addEventListener('mousedown', processMouseDown);
canvas.addEventListener('mouseenter', processMouseDown);
canvas.addEventListener('mouseup', processMouseUp);
canvas.addEventListener('touchmove', processTouchMove);
canvas.addEventListener('touchstart', processTouchStart);
canvas.addEventListener('touchend', processMouseUp);

drawNextExerciseScreen({"text": "Let's Go!", "color": light_ink});

// Cancel any mouse events fired during touch event
function processTouchStart(e){e.preventDefault(); processMouseDown(e);}
function processTouchMove(e){e.preventDefault(); processMouseMove(e);}

function processMouseMove(e){
  switch(current_canvas_mode) {
  case CanvasMode.doExercise:
    drawLearnerStroke(e);
    break;
    // TODO: default alert for safety. For now most modes don't do much.
  }
}

function processMouseDown(e){
  switch(current_canvas_mode) {
  case CanvasMode.doExercise:
    student_start_time = new Date();
    setPosition(e);
    break;
  }
}

function processMouseUp(e){
  switch(current_canvas_mode) {
  case CanvasMode.startExercise:
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current_canvas_mode = CanvasMode.doExercise;
    drawTeacherStroke();
    break;
  case CanvasMode.doExercise:
    setPosition(e);
    student_end_time = new Date();
    gradeStroke();
    student_coords = [];
    exercise_step ++;
    // We do it after because zero-indexed
    document.getElementById("strokes_done").textContent = exercise_step;
    if(exercise_step < exercise.strokes.length){
      drawTeacherStroke();
    } else {
      var exercise_result = getDescriptorFromGrade(exercise_points/exercise_possible_points);
      if(exercise_result.text == "miss"){exercise_result.color = light_ink;}
      exercise_result.text = exercise_text[exercise_result.text][Math.floor(Math.random() * exercise_text[exercise_result.text].length)];
      clearForNextExercise();
      exercise = setExerciseDefaults(chooseRandomExercise());
      drawNextExerciseScreen(exercise_result);
      current_canvas_mode = CanvasMode.startExercise;
    }
    break;
  }
}

// Reset our counters in preparation for the next exercise
function clearForNextExercise(){
  exercise_step = 0;
  exercise_step_coords = [];
  student_coords = [];
  exercise_points = 0;
  exercise_possible_points = 0;
  document.getElementById("exercise_score").textContent = 0;
  document.getElementById("strokes_done").textContent = 0;
}


// Pick a random exercise from exercises.js
function chooseRandomExercise(){
  var keys = Object.keys(exercises);
  return exercises[keys[ keys.length * Math.random() << 0]];
}

// For exercises.js cleanliness, we allow exercises to not set ALL possible properties
// For sanity in accessing them, we set them here.
function setExerciseDefaults(exercise){
    if (!exercise.hasOwnProperty('useOpacity')){
      exercise.useOpacity = false;  // Opacity will be a whole can of worms
    }
    exercise.overall_mult = 0; // This is bad and I feel bad but I'm very tired
    return exercise;
}

// Assemble the current stroke for the current exercise
function assembleTeacherStroke(){
  ctx.beginPath();
  ctx.moveTo(exercise_step_coords[0][0], exercise_step_coords[0][1]);
  for(var i = 1; i < exercise_step_coords.length; i++){
      ctx.lineTo(exercise_step_coords[i][0], exercise_step_coords[i][1]);
  }
}

// Wrapper so I can reuse assembleTeacherStroke for grading.
// It really feels like I should be able to save that path and return it to
// grade the student against, but I can't for the life of me figure out how to.
function drawTeacherStroke(){
  exercise_step_coords = convertRelativeCoordsToAbsolute(exercise.strokes[exercise_step]);
  ctx.strokeStyle = dark_ink;
  ctx.lineWidth = teacher_line_width;
  assembleTeacherStroke();
  ctx.stroke();
  ctx.strokeStyle = light_ink;
  ctx.lineWidth = student_line_width;
}

// Check what percent of the student's points lie along the teacher's path.
// As mentioned in the comment for drawTeacherStroke, I'm forced to remake the path
function gradeAccuracy(){
  var accurate_positions = 0;
  var total_positions = student_coords.length;
  assembleTeacherStroke();
  ctx.lineWidth = teacher_line_width+2;  // +1 because the width and human eye don't seem 100% aligned
  // We do this twice; once for the "perfect" match, and a second time with a wider line for "half credit"
  for(var i=0; i<student_coords.length; i++){
    if(ctx.isPointInStroke(student_coords[i][0], student_coords[i][1])){
      accurate_positions += 0.5;
    }
  }
  ctx.lineWidth = teacher_line_width*2+2;
  for(i=0; i<student_coords.length; i++){
    if(ctx.isPointInStroke(student_coords[i][0], student_coords[i][1])){
      accurate_positions += 0.5;
    }
  }
  return accurate_positions/total_positions;
}

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

// Check how long the student's path is vs. the teacher's.
// This is a stand-in for looking for "wiggliness", which would AFAIK be a nightmare to compute
// This is gameable (an awful wiggly line that HAPPENS TO BE the same length as the teacher's because it's
// too short will get full marks), so Accuracy is an important partner!
function gradeLength(){
  ideal_length = getLengthOfCoordPath(exercise_step_coords);
  student_length = getLengthOfCoordPath(student_coords);
  // You earn points if the length difference is within 50% of the ideal length or 20 pixels, whichever's smaller.
  // 50% might seem like a lot, but consider that the fail cutoff is 40% of the remaining 50%, so you'll need to
  // be better than 70% to not fail. Still might be a bit over-generous though.
  return Math.max(0, 1-Math.abs(ideal_length-student_length)/Math.min(20, ideal_length*0.5));
}

// The shorter the line, the faster you should finish it. And faster lines look better. Probably.
function gradeSpeed(){
  var elapsed_ms = student_end_time - student_start_time;
  // First we find our speed, "pixels per millisecond"
  var path_length = getLengthOfCoordPath(exercise_step_coords);
  var ppm = path_length/elapsed_ms;
  // We can multiply it to make it easier (*2 would mean "you're expected to take half
  // as many milliseconds per pixel", aka you have twice as much time to earn Glorious)
  ppm *= 1.2;
  /* Formula works like this: as the length of the line approaches 0, the bonus multiplier approaches max_bonus (where 3 means
     you have 3x as long to still earn Glorious). As the length approaches bonus_cutoff, the multiplier approaches 1. Halfway
     between 0 and the cutoff, you get half the bonus (max bonus of 3, bonus of 1 does nothing, halfway you get x2). I don't
     have proof, just graph it. */
  var bonus_cutoff = 200;
  var max_bonus = 3;
  ppm *= Math.max(1, 1+(max_bonus-1)*(bonus_cutoff-path_length)/bonus_cutoff);
  // And now we have our (completely arbitrary, still probably in need of tweaking) speed score!
  return Math.min(1, ppm);
}

/* Part of control is ending up where you're supposed to, so we give a big bonus
to the accuracy at the endpoint. Finding the "endpoint" is tricky (consider the circle).
My approach is to find the point closest to the student's starting point and declare that the "start",
then say that the point to either the left or right of it (looping around if necessary, list[-1] in Python)
must be the end. If someone misses their start point badly enough, this might result in an auto-fail
which, given the nature of the category, seems fair.
*/
function gradeEndpoint(){
  var distance = 9999;
  var min_distance = 9999;
  var start_point_offset = 0;
  var x1 = student_coords[0][0];
  var y1 = student_coords[0][1];
  for(var i=0; i<exercise_step_coords.length; i++){
    distance = getDistanceBetweenPoints(x1, y1, exercise_step_coords[i][0], exercise_step_coords[i][1]);
    if(distance < min_distance){
      min_distance = distance;
      start_point_offset = i;
    }
  }
  var left_potential_endpoint = (start_point_offset > 0) ? start_point_offset - 1 : exercise_step_coords.length-1;
  var right_potential_endpoint = (start_point_offset < exercise_step_coords.length-1) ? start_point_offset + 1 : 0;
  x1 = student_coords[student_coords.length-1][0];
  y1 = student_coords[student_coords.length-1][1];
  var left_dist = getDistanceBetweenPoints(x1, y1, exercise_step_coords[left_potential_endpoint][0], exercise_step_coords[left_potential_endpoint][1]);
  var right_dist = getDistanceBetweenPoints(x1, y1, exercise_step_coords[right_potential_endpoint][0], exercise_step_coords[right_potential_endpoint][1]);
  // You have to be within 40 pixels or 20% of the teacher line (max 120px), whichever's greater, to earn points.
  // Note that at 40 pixels, you must be within 2 pixels of the endpoint to earn a GLORIOUS, 6 at 120
  // TODO: Maybe we should store teacher path length as a toplevel.
  points_window = Math.max(40, Math.min(120, getLengthOfCoordPath(exercise_step_coords)*0.2));
  return Math.max(0, (points_window-Math.min(left_dist, right_dist))/points_window);
}

// Convert relative coordinates to absolute ones
// We assume a square canvas here and enforce it elsewhere so someone can
// create a stroke without worrying about it distorting on someone else's screen.
function convertRelativeCoordsToAbsolute(coords_list) {
  var mult = ctx.canvas.width;
  var transformed_coords = [];
  for (var i = 0; i < coords_list.length; i++){
    transformed_coords.push([coords_list[i][0]*mult,
                             coords_list[i][1]*mult]);
  }
  return transformed_coords;
}

function getDescriptorFromGrade(grade){
  if(grade > 0.95){return {"text": "GLORIOUS!", "color": "#FFAA66"};}
  if(grade > 0.82){return {"text": "Great!", "color": "#FF66FF"};}
  if(grade > 0.64){return {"text": "Good", "color": "#66CCFF"};}
  if(grade >= 0.40){return {"text": "Fair", "color": "#66FF66"};}
  return {"text": "miss", "color": "#888888"};
}

// Update the displays with the grade result and return the score and max
// Could use a better name.
function applyGrade(grade_name, grade){
  var grade_text = getDescriptorFromGrade(grade);
  var grade_text_span = document.getElementById(grade_name + "_rating");
  grade_text_span.style.color = grade_text.color;
  grade_text_span.textContent = grade_text.text;
  return [grade * exercise[grade_name+"_mult"] * exercise.point_value, exercise[grade_name+"_mult"] * exercise.point_value];
}

// Calculate the grades, distribute the points, and update the descriptors
function gradeStroke(){
  // TODO: in the future, more grade categories (opacity) and possibility of some not existing...
  var point_spreads = [];
  point_spreads.push(applyGrade("length", gradeLength()));
  point_spreads.push(applyGrade("speed", gradeSpeed()));
  point_spreads.push(applyGrade("accuracy", gradeAccuracy()));
  point_spreads.push(applyGrade("endpoint", gradeEndpoint()));
  var total_points = 0;
  var possible_points = 0;
  for(var i=0; i<point_spreads.length; i++){
    total_points += point_spreads[i][0];
    possible_points += point_spreads[i][1];
  }
  applyGrade("overall", total_points/possible_points);
  dark_ink = getDescriptorFromGrade(total_points/possible_points).color;
  total_points = Math.floor(total_points);
  exercise_possible_points += Math.floor(possible_points);
  exercise_points += total_points;
  document.getElementById("exercise_score").textContent = exercise_points;
  var total_score = document.getElementById("total_score");
  total_score.textContent = parseInt(total_score.textContent) + total_points;
}

// Move with the mouse/touch
function setPosition(e) {
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend'){
    // var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    var rect = e.target.getBoundingClientRect();
    if(e.touches.length == 0){return;}  // TODO: What is even going on here. Touchend?
    pos.x = e.touches[0].pageX - rect.left;
    pos.y = e.touches[0].pageY - rect.top;
  } else {
    pos.x = e.offsetX;
    pos.y = e.offsetY;
  }
  student_coords.push([pos.x, pos.y]);
}

// resize canvas
function resize() {
  //We reserve 20% width for score/etc and a 10whatever margin
  parent = document.getElementById("canvas_div");
  ctx.canvas.width = Math.min(parent.clientWidth, window.innerHeight-20);
  ctx.canvas.height = ctx.canvas.width;
}

function drawLearnerStroke(e) {
  // mouse left button must be pressed (or a touchmove)
  if (e.buttons !== 1 && e.type !== "touchmove") return;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

// I'd like this screen to become more lively as the score gets higher
// It's the main "reward". Maybe it could have flowers and the like "sprouting" from the bottom
function drawNextExerciseScreen(encouragement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = big_font;
  ctx.lineWidth = student_line_width;
  var positions = convertRelativeCoordsToAbsolute([[0.5, 0.3], [0.5, 0.4], [0.5, 0.55], [0.5, 0.7]]);
  ctx.textAlign = "center";
  ctx.fillStyle = encouragement.color;
  ctx.fillText(encouragement.text, positions[0][0], positions[0][1]);
  ctx.fillStyle = light_ink;
  ctx.fillText("Next: "+exercise.title, positions[1][0], positions[1][1]);
  ctx.font = small_font;
  var description_string = exercise.description + " [Author: " + exercise.author + "]";
  ctx.fillText(description_string, positions[2][0], positions[2][1]);
  ctx.fillText("[tap to continue]", positions[3][0], positions[3][1]);
  document.getElementById("strokes_total").textContent = exercise.strokes.length;
}
