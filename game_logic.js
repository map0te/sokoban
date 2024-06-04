export class Game {
	constructor() {
		this.num_levels = 17;
		this.game = Array();
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
				[1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 2, 0, 3, 4, 1],
				[1, 0, 0, 0, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 1, 0, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 1, 4, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 1, 1, 1, 0, 0, 1],
				[1, 0, 0, 1, 0, 0, 0, 0, 1],
				[1, 0, 2, 1, 0, 0, 0, 0, 1],
				[1, 0, 3, 1, 0, 0, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1],
				[1, 1, 0, 0, 1, 1],
				[1, 0, 0, 0, 0, 1],
				[1, 4, 2, 2, 4, 1],
				[1, 0, 0, 0, 0, 1],
				[1, 1, 3, 1, 1, 1],
				[1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 4, 1],
				[1, 0, 0, 0, 2, 2, 3, 1],
				[1, 0, 0, 1, 0, 0, 4, 1],
				[1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 3, 1],
				[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
				[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
				[1, 0, 2, 1, 0, 0, 0, 0, 0, 1, 0, 1],
				[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 4, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1],
				[1, 4, 0, 0, 4, 1],
				[1, 0, 2, 2, 0, 1],
				[1, 2, 0, 1, 0, 1],
				[1, 3, 0, 0, 4, 1],
				[1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 0, 0, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 2, 0, 1],
				[1, 0, 1, 0, 0, 1, 2, 0, 1],
				[1, 0, 4, 0, 4, 1, 3, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 0, 0],
				[1, 0, 0, 0, 1, 1, 0],
				[1, 3, 2, 0, 0, 1, 1],
				[1, 1, 0, 2, 0, 0, 1],
				[0, 1, 1, 0, 2, 0, 1],
				[0, 0, 1, 1, 0, 0, 1],
				[0, 0, 0, 1, 1, 4, 1],
				[0, 0, 0, 0, 1, 4, 1],
				[0, 0, 0, 0, 1, 4, 1],
				[0, 0, 0, 0, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1],
				[1, 4, 0, 0, 0, 4, 1],
				[1, 0, 2, 2, 1, 0, 1],
				[1, 0, 2, 0, 1, 3, 1],
				[1, 1, 2, 0, 1, 0, 1],
				[1, 4, 0, 0, 4, 0, 1],
				[1, 1, 1, 1, 1, 1, 1]],

			[[0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
				[1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
				[1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
				[1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 1, 0, 1, 4, 0, 4, 1],
				[1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 4, 0, 0, 0, 0, 0, 2, 0, 1],
				[1, 0, 2, 0, 0, 0, 0, 0, 4, 1],
				[1, 0, 3, 0, 0, 0, 0, 0, 2, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 4, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
			[[1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 1, 0, 0, 0, 0, 1],
				[1, 0, 2, 1, 4, 0, 0, 0, 1],
				[1, 0, 2, 0, 4, 0, 0, 0, 1],
				[1, 3, 2, 1, 1, 1, 0, 0, 1],
				[1, 0, 0, 1, 4, 0, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 2, 2, 0, 1],
				[1, 0, 2, 0, 2, 3, 1],
				[1, 4, 4, 1, 1, 1, 1],
				[1, 4, 4, 1, 0, 0, 0],
				[1, 1, 1, 1, 0, 0, 0]],

			[[1, 1, 1, 1, 1, 0, 0, 0],
				[1, 0, 0, 0, 1, 0, 0, 0],
				[1, 2, 1, 0, 1, 1, 1, 1],
				[1, 4, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 5, 0, 5, 0, 1],
				[1, 0, 5, 0, 1, 0, 1, 1],
				[1, 1, 1, 0, 3, 0, 1, 0],
				[0, 0, 1, 1, 1, 1, 1, 0]],

			[[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 3, 0, 0, 1, 0, 0, 0, 4, 1],
				[1, 0, 2, 0, 2, 0, 0, 4, 4, 1],
				[1, 0, 2, 2, 2, 1, 1, 4, 4, 1],
				[1, 0, 0, 0, 0, 1, 1, 4, 4, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			]];
	}

	new_level() {
		this.index = Math.floor(Math.random()*num_levels);
		this.game = structured.clone(this.levels[this.index]);
	}

	next_level() {
		this.index = (this.index+1)%this.num_levels;
		this.game = structuredClone(this.levels[this.index]);
	}

	prev_level() {
		if (this.index == 0)
			this.index = 16;
		else
			this.index = (this.index-1)%this.num_levels;
		this.game = structuredClone(this.levels[this.index]);
	}

	reset_level() {
		this.game = structuredClone(this.levels[this.index]);
	}

	is_solved() {
		for(let i=0; i < this.game.length; i++)
			for (let j=0; j < this.game[0].length; j++)
				if (this.game[i][j] == 2)
					return false;
		return true;
	}


	get_keeper_pos() {
		for(let i=0; i < this.game.length; i++)
			for (let j=0; j < this.game[0].length; j++) {
				if (this.game[i][j] == 3 || this.game[i][j] == 6)
					return [i,j];
			}
		return "fail";
	}

	move(move, attempt) {
		// attempt to make given move
		let kpos = this.get_keeper_pos();
		let row = kpos[0];
		let col = kpos[1];
		let sx = this.game.length;
		let sy = this.game[0].length;

		let mx = move[0];
		let my = move[1];

		if (this.game[row+mx][col+my] == 0 || this.game[row+mx][col+my] == 4) {
			if (!attempt) {
				if (this.game[row+mx][col+my] == 0)
					this.game[row+mx][col+my] = 3;
				else
					this.game[row+mx][col+my] = 6;
				if (this.game[row][col] == 3)
					this.game[row][col] = 0;
				else
					this.game[row][col] = 4;
			}
			return 1
		} else if (this.game[row+mx][col+my] == 2 || this.game[row+mx][col+my] == 5) {
			if (this.game[row+2*mx][col+2*my] == 0 || this.game[row+2*mx][col+2*my] == 4) {
				if (!attempt) {
					if (this.game[row+mx][col+my] == 2)
						this.game[row+mx][col+my] = 3;
					else
						this.game[row+mx][col+my] = 6;
					if (this.game[row][col] == 3)
						this.game[row][col] = 0;
					else
						this.game[row][col] = 4;
					if (this.game[row+2*mx][col+2*my] == 0)
						this.game[row+2*mx][col+2*my] = 2;
					else
						this.game[row+2*mx][col+2*my] = 5;
				}	
				return 2
			}
		}
		return 0
	}

	ai_sol() {
		// return list of moves for automatic
		// solution
		return 0
	}

}

