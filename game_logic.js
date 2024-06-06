class PriorityQueue {
	constructor() {
		this.nodes = [];
		this.costs = [];
	}

	put(node, cost) { 
		this.nodes.push(node);
		this.costs.push(cost);
	}

	get() {
		let count = this.nodes.length;
		if (count == 0)
			return null;
		let index = 0;
		let min = this.costs[0];
		for (let i=0; i < count; i++) {
			if (this.costs[i] < min) {
				index = i;
				min = this.costs[i];
			}
		}
		let node = this.nodes[index];
		this.nodes.splice(index, 1);
		this.costs.splice(index, 1);
		return node;
	}
}

class PathNode {
	constructor(state, par, cost, ev, move) {
		this.state = [];
		this.move = move;
		let row = state.length;
		let col = state[0].length;
		for (let i=0; i<row; i++)
			for (let j=0; j<col; j++)
				this.state.push(state[i][j]);
		this.state1 = state;
		this.par = par;
		this.cost = cost;
		this.ev = ev;
	}
}

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

			[[1, 1, 1, 1, 1, 7, 7],
				[1, 0, 0, 0, 1, 1, 7],
				[1, 3, 2, 0, 0, 1, 1],
				[1, 1, 0, 2, 0, 0, 1],
				[7, 1, 1, 0, 2, 0, 1],
				[7, 7, 1, 1, 0, 0, 1],
				[7, 7, 7, 1, 1, 4, 1],
				[7, 7, 7, 7, 1, 4, 1],
				[7, 7, 7, 7, 1, 4, 1],
				[7, 7, 7, 7, 1, 1, 1]],

			[[1, 1, 1, 1, 1, 1, 1],
				[1, 4, 0, 0, 0, 4, 1],
				[1, 0, 2, 2, 1, 0, 1],
				[1, 0, 2, 0, 1, 3, 1],
				[1, 1, 2, 0, 1, 0, 1],
				[1, 4, 0, 0, 4, 0, 1],
				[1, 1, 1, 1, 1, 1, 1]],

			[[7, 7, 7, 7, 1, 1, 1, 1, 1, 7, 7, 7],
				[1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
				[1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
				[1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 1, 7, 1, 4, 0, 4, 1],
				[1, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1]],

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
				[1, 4, 4, 1, 7, 7, 7],
				[1, 1, 1, 1, 7, 7, 7]],

			[[1, 1, 1, 1, 1, 7, 7, 7],
				[1, 0, 0, 0, 1, 7, 7, 7],
				[1, 2, 1, 0, 1, 1, 1, 1],
				[1, 4, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 5, 0, 5, 0, 1],
				[1, 0, 5, 0, 1, 0, 1, 1],
				[1, 1, 1, 0, 3, 0, 1, 7],
				[7, 7, 1, 1, 1, 1, 1, 7]],

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

	is_solved(game) {
		for(let i=0; i < game.length; i++)
			for (let j=0; j < game[0].length; j++)
				if (game[i][j] == 2)
					return false;
		return true;
	}


	get_keeper_pos(game) {
		for(let i=0; i < game.length; i++)
			for (let j=0; j < game[0].length; j++) {
				if (game[i][j] == 3 || game[i][j] == 6)
					return [i,j];
			}
		return "fail";
	}

	move(move, attempt, game) {
		// attempt to make given move
		let kpos = this.get_keeper_pos(game);
		let row = kpos[0];
		let col = kpos[1];
		let sx = game.length;
		let sy = game[0].length;

		let mx = move[0];
		let my = move[1];

		if (game[row+mx][col+my] == 0 || game[row+mx][col+my] == 4) {
			if (!attempt) {
				if (game[row+mx][col+my] == 0)
					game[row+mx][col+my] = 3;
				else
					game[row+mx][col+my] = 6;
				if (game[row][col] == 3)
					game[row][col] = 0;
				else
					game[row][col] = 4;
			}
			return 1
		} else if (game[row+mx][col+my] == 2 || game[row+mx][col+my] == 5) {
			if (game[row+2*mx][col+2*my] == 0 || game[row+2*mx][col+2*my] == 4) {
				if (!attempt) {
					if (game[row+mx][col+my] == 2)
						game[row+mx][col+my] = 3;
					else
						game[row+mx][col+my] = 6;
					if (game[row][col] == 3)
						game[row][col] = 0;
					else
						game[row][col] = 4;
					if (game[row+2*mx][col+2*my] == 0)
						game[row+2*mx][col+2*my] = 2;
					else
						game[row+2*mx][col+2*my] = 5;
				}	
				return 2
			}
		}
		return 0
	}

	heuristic(state) {
		let dsb = 0;
		let dkb = 0;
		let pos = this.get_keeper_pos(state);
		let boxes = [];
		let goals = [];
		for(let i=0; i < state.length; i++)
			for (let j=0; j < state[0].length; j++) {
				if (state[i][j] == 2)
					boxes.push([i,j]);
				else if (state[i][j] == 4 || state[i][j] == 6)
					goals.push([i,j]);
			}
		for(let i=0; i < boxes.length; i++) {
			let mkb = Math.abs(pos[0]-boxes[i][0]) + Math.abs(pos[1]-boxes[i][1])-1
			if (mkb < dkb)
				dkb = mkb;
			let msb = Math.abs(goals[0][0]-boxes[i][0]) + Math.abs(goals[0][1]-boxes[i][1]);
			for(let j=0; j < goals.length; j++) {
				let dis = Math.abs(goals[j][0]-boxes[i][0]) + Math.abs(goals[j][1]-boxes[i][1]);
				if (dis < msb)
					msb = dis;
			}
			dsb = dsb + msb;
		}
		return dsb;
	}

	next_moves(state) {
		let m1 = structuredClone(state);
		let m2 = structuredClone(state);
		let m3 = structuredClone(state);
		let m4 = structuredClone(state);
		let states = [];
		let moves = [];

		if (this.move([1,0], true, state)) {
			this.move([1,0], false, m1);
			states.push(m1);
			moves.push([1,0]);
		}
		if (this.move([-1,0], true, state)) {
			this.move([-1,0], false, m2);
			states.push(m2);
			moves.push([-1,0]);
		}
		if (this.move([0,1], true, state)) {
			this.move([0,1], false, m3);
			states.push(m3);
			moves.push([0,1]);
		}
		if (this.move([0,-1], true, state)) {
			this.move([0,-1], false, m4);
			states.push(m4);
			moves.push([0,-1]);
		}
		return [states, moves];
	}

	a_star(start_state) {
		let pq = new PriorityQueue();
		let initial_node = new PathNode(start_state, null, 0, this.heuristic(start_state), [0,0]);
		pq.put(initial_node, this.heuristic(start_state));
		let explored = new Map();

		while (pq.nodes.length != 0) {
			let node = pq.get();
			if (this.is_solved(node.state1))
				return node;
			let old_cost = explored.get(node.state);
			if (old_cost != null && old_cst <= node.cost) 
				continue;
			explored.set(node.state, node.cost);
			let ns = this.next_moves(node.state1);
			let s = ns[0];
			let m = ns[1];
			for (let i=0; i < s.length; i++) {
				let new_cost = node.cost + 1;
				let new_node = new PathNode(s[i], node, new_cost, new_cost+this.heuristic(s[i]), m[i]);
				pq.put(new_node, new_cost + this.heuristic(s[i]));
			}
		}
		return null;
	}

	ai_sol() {
		// return list of moves for automatic
		// solution
		let goal_node = this.a_star(structuredClone(this.game));
		if (goal_node != null) {
			let node = goal_node;
			let path = [node.move]
			while (node.par != null) {
				node = node.par;
				path.push(node.move);
			}
			return path.reverse();
		} else {
			return []
		}
	}
}

