function Region(type, min_size, max_size, frequency) {
	this.type = type;
	this.size = Math.floor(Math.random() * (max_size - min_size)) + min_size;
	this.frequency = frequency;
}

Region.prototype = {
	zone_type_mod : function(weight) {
		return weight;
	},
	road_probability_mod : function(weight) {
		return weight;
	}
}

//-------------------------------------------------------------
//------KINGDOM REGION-----------------------------------------
//-------------------------------------------------------------
function Kingdom() {
}

Kingdom.prototype = new Region('Kingdom', 10, 50, 25);

//-------------------------------------------------------------
//------WILDERNESS REGION--------------------------------------
//-------------------------------------------------------------
function Wilderness() {
	zone_type_list = [Forest, Plains, Hills, Mountains, undefined];
	this.primary_zone_type = zone_type_list[Math.floor(Math.random()*zone_type_list.length)];
	this.secondary_zone_type = zone_type_list[Math.floor(Math.random()*zone_type_list.length)];
}

Wilderness.prototype = new Region('Wilderness', 5, 80, 25);
Wilderness.prototype.zone_type_mod = function(weight) {
	if (typeof this.primary_zone_type !== 'undefined') {
		weight[1][weight[0].indexOf(this.primary_zone_type)] = Math.floor(weight[1][weight[0].indexOf(this.primary_zone_type)] * 1.5);
	}
	if (typeof this.secondary_zone_type !== 'undefined') {
		weight[1][weight[0].indexOf(this.secondary_zone_type)] = Math.floor(weight[1][weight[0].indexOf(this.secondary_zone_type)] * 1.25);
	}
	return weight;
}
Wilderness.prototype.road_probability_mod = function(probability) {
	return Math.ceil(probability / 2);
}

//-------------------------------------------------------------
//------SEA REGION---------------------------------------------
//-------------------------------------------------------------
function Sea() {
}

Sea.prototype = new Region('Sea', 20, 50, 25);
Sea.prototype.zone_type_mod = function(weight) {
	weight[1][weight[0].indexOf(Forest)] = Math.floor(weight[1][weight[0].indexOf(Forest)] / 2);
	weight[1][weight[0].indexOf(Plains)] = Math.floor(weight[1][weight[0].indexOf(Plains)] / 2);
	weight[1][weight[0].indexOf(Hills)] = Math.floor(weight[1][weight[0].indexOf(Hills)] / 2);
	weight[1][weight[0].indexOf(Water)] *= 10;
	return weight;
}
Sea.prototype.road_probability_mod = function(probability) {
	return Math.floor(probability / 10);
}
