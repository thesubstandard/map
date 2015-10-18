var STAGE_WIDTH = 1050; //15 tiles
var STAGE_HEIGHT = 700; //10 tiles

//RAW_TILE_SIZE is the width of a tile in pixels
var RAW_TILE_SIZE = 140;
//The actual TILE_SIZE is multipled by the SCALE constant
var SCALE = 0.5;

var TILE_SIZE = RAW_TILE_SIZE * SCALE;

function tile(x_coordinate, y_coordinate, image, scale_mod, x_shift, y_shift) {
	//image is an array of all possible images for a given tile type;
	//scale_mod is an array of all the scaling modifiers for each of those images
	tile_index = Math.floor(Math.random() * image.length);
	var tile = new createjs.Bitmap(image[tile_index]);
	tile.scaleX = SCALE * scale_mod[tile_index];
	tile.scaleY = SCALE * scale_mod[tile_index];

	tile.x = x_coordinate * TILE_SIZE - TILE_SIZE * 0.5;
	tile.x += STAGE_WIDTH / 2;
	tile.x -= (scale_mod[tile_index] - 1) * TILE_SIZE / 2;
	tile.x += TILE_SIZE * x_shift[tile_index];

	tile.y = y_coordinate * TILE_SIZE - TILE_SIZE * 0.5;
	tile.y += STAGE_HEIGHT / 2;
	tile.y -= (scale_mod[tile_index] - 1) * TILE_SIZE / 2;
	tile.y += TILE_SIZE * y_shift[tile_index];

	return tile;
}

function landTile(x_coordinate, y_coordinate) {
	image = ['art/map/Land.jpg']
	scale_mod = [1]
	x_shift = [0]
	y_shift = [0]
	return tile(x_coordinate, y_coordinate, image, scale_mod, x_shift, y_shift);
}

function forestTile(x_coordinate, y_coordinate) {
	image = ['art/map/Forest1.png']
	scale_mod = [1.3]
	x_shift = [0]
	y_shift = [0]
	return tile(x_coordinate, y_coordinate, image, scale_mod, x_shift, y_shift);
}

function mountainTile(x_coordinate, y_coordinate) {
	image = ['art/map/Mountains1.png', 'art/map/Mountains2.png', 'art/map/Mountains3.png', 'art/map/Mountains4.png', 'art/map/Mountains5.png']
	scale_mod = [1, 1.2, 1, 1, 0.65]
	x_shift = [0, 0, 0, 0, -0.4]
	y_shift = [0, 0, 0, 0, -0.4]
	return tile(x_coordinate, y_coordinate, image, scale_mod, x_shift, y_shift);
}

function hillTile(x_coordinate, y_coordinate) {
	image = ['art/map/Hills1.png', 'art/map/Hills2.png', 'art/map/Hills3.png']
	scale_mod = [1.2, 1.2, 1.2]
	x_shift = [0, 0, 0]
	y_shift = [0, 0, 0]
	return tile(x_coordinate, y_coordinate, image, scale_mod, x_shift, y_shift);
}