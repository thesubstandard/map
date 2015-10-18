function Map(name) {
	this.name = name;
	this.grid = [];
	this.min_x = 0;
	this.max_x = 0;
	this.min_y = 0;
	this.max_y = 0;
	this.tile_container = new createjs.Container();
}

Map.prototype = {
	opposite : function(direction) {
		if (direction == 'North') {
			return 'South';
		} else if (direction == 'East') {
			return 'West';
		} else if (direction == 'South') {
			return 'North';
		} else if (direction == 'West') {
			return 'East';
		} else {
			console.log("Map.opposite error: Must input compass direction.")
			return false;
		}

	},

	adjacent_r : function(direction) {
		if (direction == 'North') {
			return 'East';
		} else if (direction == 'East') {
			return 'South';
		} else if (direction == 'South') {
			return 'West';
		} else if (direction == 'West') {
			return 'North';
		} else {
			console.log("Map.adjacent_r error: Must input compass direction.");
			return false;
		}
	},

	adjacent_l : function(direction) {
		if (direction == 'North') {
			return 'West';
		} else if (direction == 'East') {
			return 'North';
		} else if (direction == 'South') {
			return 'East';
		} else if (direction == 'West') {
			return 'South';
		} else {
			console.log("Map.adjacent_l error: Must input compass direction.");
			return false;
		}
	},

	distance : function(x_1, y_1, x_2, y_2) {
		return Math.abs(x_1 - x_2) + Math.abs(y_1 - y_2);
	},

	zone : function(x_coordinate, y_coordinate) {
		if (typeof this.grid[x_coordinate] === 'undefined') {
			return undefined;
		} else {
			return this.grid[x_coordinate][y_coordinate];
		}
	},

	relative_zone : function(x_coordinate, y_coordinate, direction, distance) {
		if (direction == 'North') {
			x = x_coordinate;
			y = y_coordinate + distance;
		} else if (direction == 'East') {
			x = x_coordinate + distance;
			y = y_coordinate;
		} else if (direction == 'South') {
			x = x_coordinate;
			y = y_coordinate - distance;
		} else if (direction == 'West') {
			x = x_coordinate - distance;
			y = y_coordinate;
		} else if (direction == 'Northeast') {
			x = x_coordinate + distance;
			y = y_coordinate + distance;
		} else if (direction == 'Southeast') {
			x = x_coordinate + distance;
			y = y_coordinate - distance;
		} else if (direction == 'Southwest') {
			x = x_coordinate - distance;
			y = y_coordinate - distance;
		} else if (direction == 'Northwest') {
			x = x_coordinate - distance;
			y = y_coordinate + distance;
		} else {
			console.log("Map.relative_zone error: Must input compass direction.")
			return false;
		}
		return this.zone(x, y);
	},

	add_zone : function(x_coordinate, y_coordinate, zone) {
		if (typeof this.zone(x_coordinate, y_coordinate) !== 'undefined') {
			console.log("Map.add_zone error: zone already filled, cannot overwrite.");
			return false;
		}

		if (typeof this.grid[x_coordinate] === 'undefined') {
			this.grid[x_coordinate] = [];
		}
		//Add the zone to the grid:
		this.grid[x_coordinate][y_coordinate] = zone;

		//Add the zone to the display list:
		for (i = 0; i < this.zone(x_coordinate, y_coordinate).layer.length; i++ ) {
			this.tile_container.addChild(this.zone(x_coordinate, y_coordinate).layer[i])
		}

		//Update max and min x and y:
		if (x_coordinate > this.max_x) {
			this.max_x = x_coordinate;
		} else if (x_coordinate < this.min_x) {
			this.min_x = x_coordinate;
		}
		if (y_coordinate > this.max_y) {
			this.max_y = y_coordinate;
		} else if (y_coordinate < this.min_y) {
			this.min_y = y_coordinate;
		}

		return true;
	},

	remove_zone : function(x_coordinate, y_coordinate) {
		if (typeof this.zone(x_coordinate, y_coordinate) === 'undefined') {
			console.log("Map.remove_zone error: zone already empty, cannot remove.");
		} else {
			delete this.grid[x_coordinate][y_coordinate];
		}
	},

	remove_all_zones : function() {
		count = 0
		for (x = this.min_x; x <= this.max_x; x++) {
			for (y = this.min_y; y <= this.max_y; y++) {
				if (typeof this.zone(x, y) !== 'undefined') {
					delete this.grid[x][y];
					count = count + 1;
				}
			}
		}
		return count + " zones removed"
	},

	generate_zone : function(x_coordinate, y_coordinate, region) {
		if (typeof this.zone(x_coordinate, y_coordinate) !== 'undefined') {
			console.log("Map.generate_zone error: zone already filled, cannot overwrite.");
		}

		var direction = ['North', 'East', 'South', 'West'];
		var diagonal_direction = ['Northeast', 'Southeast', 'Southwest', 'Northwest'];

		//Initialize zone type weights:
		var zone_type = [Forest, Plains, Hills, Mountains];
		var weight = [zone_type, []];
		for (i = 0; i < zone_type.length; i++) {
			weight[1][i] = zone_type[i].prototype.frequency;
		}

		//Initialize roads:
		var road = {}
		road['North'] = undefined;
		road['East'] = undefined;
		road['South'] = undefined;
		road['West'] = undefined;

		//Determine roads from surrounding roads:
		for (i = 0; i < direction.length; i++) {
			if (typeof this.relative_zone(x_coordinate, y_coordinate, direction[i], 1) !== 'undefined') {
				road[direction[i]] = this.relative_zone(x_coordinate, y_coordinate, direction[i], 1).road(this.opposite(direction[i]));
			}
		}

		//Add weight for adjacent zones:
		for (i = 0; i < direction.length; i++) {
			if (typeof this.relative_zone(x_coordinate, y_coordinate, direction[i], 1) !== 'undefined') {
				this.relative_zone(x_coordinate, y_coordinate, direction[i], 1).adjacent(weight);
			}
		}

		//Add weight for diagonal zones:
		for (i = 0; i < direction.length; i++) {
			if (typeof this.relative_zone(x_coordinate, y_coordinate, diagonal_direction[i], 1) !== 'undefined') {
				this.relative_zone(x_coordinate, y_coordinate, diagonal_direction[i], 1).diagonal(weight);
			}
		}

		//Add weight for lines of zones:
		for (i = 0; i < direction.length; i++) {
			if (typeof this.relative_zone(x_coordinate, y_coordinate, direction[i], 1) !== 'undefined'
					&& typeof this.relative_zone(x_coordinate, y_coordinate, direction[i], 2) !== 'undefined'
					&& this.relative_zone(x_coordinate, y_coordinate, direction[i], 1).type == this.relative_zone(x_coordinate, y_coordinate, direction[i], 2).type) {
				this.relative_zone(x_coordinate, y_coordinate, direction[i], 1).line(weight);
			}
		}

		//Modify weight based on region:
		region.zone_type_mod(weight);

		//Set weight to 0 for roadless terrain types if any roads are present:
		if (road.North == true || road.East == true || road.South == true || road.West == true) {
			weight[1][weight[0].indexOf(Water)] = 0;
		}

		//Pick zone type:
		var total_weight = 0;
		for (i = 0; i < zone_type.length; i++) {
			total_weight += weight[1][i]
		}
		random_number = Math.floor((Math.random() * total_weight) + 1);

		for (i = 0; i < zone_type.length; i++) {
			if (1 <= random_number && random_number <= weight[1][i]) {
				var chosen_zone_type = weight[0][i];
				break;
			} else {
				random_number -= weight[1][i];
			}
		}

		//Set road probabilities:
		road_probability = {};

		for (i = 0; i < direction.length; i++) {
			if (typeof road[direction[i]] === 'undefined') {
				road_probability[direction[i]] = chosen_zone_type.prototype.road_frequency;
			}
		}

		//Modify road probabilities to favor continuation of roads:

		for (i = 0; i < direction.length; i++) {
			if (typeof road[direction[i]] === 'undefined') {
				if (road[this.opposite(direction[i])] == true && road[this.adjacent_l(direction[i])] != true && road[this.adjacent_r(direction[i])] != true) {
					road_probability[direction[i]] += chosen_zone_type.prototype.road_continue_frequency * 2;
				} else if (road[this.adjacent_l(direction[i])] == true && road[this.adjacent_r(direction[i])] != true) {
					road_probability[direction[i]] += chosen_zone_type.prototype.road_continue_frequency;
				} else if (road[this.adjacent_r(direction[i])] == true && road[this.adjacent_l(direction[i])] != true) {
					road_probability[direction[i]] += chosen_zone_type.prototype.road_continue_frequency;
				}
			}
		}

		//Modify road probabilities based on region type:
		for (i = 0; i < direction.length; i++) {
			if (typeof road[direction[i]] === 'undefined') {
				road_probability[direction[i]] = region.road_probability_mod(road_probability[direction[i]]);
			}
		}

		//Fill in remaining roads:
		for (i = 0; i < direction.length; i++) {
			if (typeof road[direction[i]] === 'undefined') {
				random_number = Math.floor(Math.random() * 100);
				if (random_number <= road_probability[direction[i]]) {
					road[direction[i]] = true;
				}
			}
		}

		//Second chance to extend road for zones that have roads in exactly 1 direction:
		var road_count = 0;
		for (i = 0; i < direction.length; i++) {
			if (road[direction[i]] === true) {
				road_count += 1;
			}
		}

		if (road_count === 1) {
			for (i = 0; i < direction.length; i++) {
				if (road[direction[i]] === true && typeof this.relative_zone(x_coordinate, y_coordinate, this.opposite(direction[i]), 1) === 'undefined') {
					random_number = Math.floor(Math.random() * 100);
					if (random_number <= road_probability[direction[i]] + chosen_zone_type.prototype.road_continue_frequency) {
						road[this.opposite(direction[i])] = true;
					}
					break
				}
			}
		}

		//Create zone:
		this.add_zone(x_coordinate, y_coordinate, new chosen_zone_type(x_coordinate, y_coordinate, region, road['North'], road['East'], road['South'], road['West']));
	}
}
