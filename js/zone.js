function Zone(type, frequency, road_frequency, road_continue_frequency) {
	this.type = type;
	this.frequency = frequency;
	this.road_frequency = road_frequency;
	this.road_continue_frequency = road_continue_frequency;
}

Zone.prototype = {
	initialize : function (region, north_road, east_road, south_road, west_road) {
		this.region = region;
		this.north_road = north_road;
		this.east_road = east_road;
		this.south_road = south_road;
		this.west_road = west_road;
	},
	road : function (direction) {
		if (direction == "North") {
			return this.north_road;
		} else if (direction == "East") {
			return this.east_road;
		} else if (direction == "South") {
			return this.south_road;
		} else if (direction == "West") {
			return this.west_road;
		} else {
			console.log("Zone.road error: must input a compass direction.");
		}
	},
	adjacent : function (weight) {
		return weight;
	},
	diagonal : function (weight) {
		return weight;
	},
	line : function (weight) {
		return weight;
	}
}

//-------------------------------------------------------------
//------FOREST ZONE--------------------------------------------
//-------------------------------------------------------------
function Forest(x_coordinate, y_coordinate, region, north_road, east_road, south_road, west_road) {
	this.initialize(region, north_road, east_road, south_road, west_road);
	this.layer = [];
	this.layer[0] = landTile(x_coordinate, y_coordinate);
	this.layer[1] = forestTile(x_coordinate, y_coordinate);
}

Forest.prototype = new Zone('Forest', 30, 5, 20);
Forest.prototype.adjacent = function(weight) {
	weight[1][weight[0].indexOf(Forest)] += this.frequency;
}
Forest.prototype.diagonal = function(weight) {
	weight[1][weight[0].indexOf(Forest)] += this.frequency;
}

//-------------------------------------------------------------
//------PLAINS ZONE--------------------------------------------
//-------------------------------------------------------------
function Plains(x_coordinate, y_coordinate, region, north_road, east_road, south_road, west_road) {
	this.initialize(region, north_road, east_road, south_road, west_road);
	this.layer = [];
	this.layer[0] = landTile(x_coordinate, y_coordinate);
}

Plains.prototype = new Zone('Plains', 60, 10, 26);
Plains.prototype.adjacent = function(weight) {
	weight[1][weight[0].indexOf(Plains)] += Math.floor(this.frequency * 2 / 3);
}

//-------------------------------------------------------------
//------HILLS ZONE---------------------------------------------
//-------------------------------------------------------------
function Hills(x_coordinate, y_coordinate, region, north_road, east_road, south_road, west_road) {
	this.initialize(region, north_road, east_road, south_road, west_road);
	this.layer = [];
	this.layer[0] = landTile(x_coordinate, y_coordinate);
	this.layer[1] = hillTile(x_coordinate, y_coordinate);
}

Hills.prototype = new Zone('Hills', 10, 5, 25);
Hills.prototype.adjacent = function(weight) {
	weight[1][weight[0].indexOf(Hills)] += this.frequency * 3;
	weight[1][weight[0].indexOf(Mountains)] += Math.floor(this.frequency * 3 / 2);
}
Hills.prototype.line = function(weight) {
	weight[1][weight[0].indexOf(Hills)] += this.frequency;
	weight[1][weight[0].indexOf(Mountains)] += this.frequency;
}

//-------------------------------------------------------------
//------MOUNTAINS ZONE-----------------------------------------
//-------------------------------------------------------------
function Mountains(x_coordinate, y_coordinate, region, north_road, east_road, south_road, west_road) {
	this.initialize(region, north_road, east_road, south_road, west_road);
	this.layer = [];
	this.layer[0] = landTile(x_coordinate, y_coordinate);
	this.layer[1] = mountainTile(x_coordinate, y_coordinate);
}

Mountains.prototype = new Zone('Mountains', 5, 1, 15);
Mountains.prototype.adjacent = function(weight) {
	weight[1][weight[0].indexOf(Mountains)] += this.frequency * 9;
	weight[1][weight[0].indexOf(Hills)] += this.frequency * 2;
}
Mountains.prototype.line = function(weight) {
	weight[1][weight[0].indexOf(Mountains)] += this.frequency * 16;
	weight[1][weight[0].indexOf(Hills)] += this.frequency;
}

//-------------------------------------------------------------
//------WATER ZONE---------------------------------------------
//-------------------------------------------------------------
function Water(x_coordinate, y_coordinate, region, north_road, east_road, south_road, west_road) {
	this.initialize(region, north_road, east_road, south_road, west_road);
	this.layer = [];
}

Water.prototype = new Zone('Water', 5, 0, 0);
Water.prototype.adjacent = function(weight) {
	weight[1][weight[0].indexOf(Water)] += this.frequency * 15;
}
Water.prototype.diagonal = function(weight) {
	weight[1][weight[0].indexOf(Water)] += this.frequency * 10;
}
Water.prototype.line = function(weight) {
	weight[1][weight[0].indexOf(Water)] += this.frequency * 5;
}
