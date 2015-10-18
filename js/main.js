document.getElementById('gameCanvas').width = STAGE_WIDTH;
document.getElementById('gameCanvas').height = STAGE_HEIGHT;

var stage = new createjs.Stage('gameCanvas');

var test_map = new Map('Test');

var x = 0;
var y = 0;

test_map.generate_zone(x, y, new Wilderness);

console.log(x + ', ' + y);

// createjs.Ticker.addEventListener("tick", handleTick);
// function handleTick(event) {
// 	stage.update();
// }