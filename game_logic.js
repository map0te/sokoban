export class Game {
	constructor() {
		this.num_levels = 3;
		this.game = [];
		this.index = 0;
		this.levels = [[[1, 1, 1, 1, 1, 1],
      					[1, 0, 3, 0, 0, 1],
      					[1, 0, 2, 0, 0, 1],
      					[1, 1, 0, 1, 1, 1],
      					[1, 0, 0, 0, 0, 1],
      					[1, 0, 0, 0, 4, 1],
      					[1, 1, 1, 1, 1, 1]],

					   [[1, 1, 1, 1, 1, 1, 1],
      					[1, 0, 0, 0, 0, 0, 1],
      					[1, 0, 0, 0, 0, 0, 1],
      					[1, 0, 0, 2, 1, 4, 1],
      					[1, 3, 0, 0, 1, 0, 1],
      					[1, 1, 1, 1, 1, 1, 1]]

	 				   [[1, 1, 1, 1, 1, 1, 1, 1, 1],
      					[1, 0, 0, 0, 1, 0, 0, 0, 1],
      					[1, 0, 0, 0, 2, 0, 3, 4, 1],
      					[1, 0, 0, 0, 1, 0, 0, 0, 1],
      					[1, 0, 0, 0, 1, 0, 0, 0, 1],
      					[1, 1, 1, 1, 1, 1, 1, 1, 1]]];
	}

	new_level() {
		this.index = Math.floor(Math.random()*num_levels);
		this.game = this.levels[this.index];
	}

	next_level() {
		this.index = (this.index+1)%this.num_levels;
		this.game = this.levels[this.index];
	}

	reset_level() {
		this.game = this.levels[this.index];
	}

	move(move) {
		// attempt to make given move
		// return 1 on success
		return 0
	}

	ai_sol() {
		// return list of moves for automatic
		// solution
		return 0
	}
}

