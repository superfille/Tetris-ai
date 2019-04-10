Tetris.Genetic = function(game) {
	this.tetrisGame = game;

	this.population = [];
	this.testIndividual = new Individual();
	Tetris.Heuristics.init();
}

const randomNumber = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Individual {
	fitness = 0;
	genes = [];

	constructor() {
			
	}

	calcFitness() {
      
  }
}

class Population {
	populationSize = 10;
	individuals = [];
	fittest = 0;

	mom = undefined;
	dad = undefined;
	child = undefined;

	constructor(size) {
		for (i = 0; i < size; i++) {
      individuals.push(new Individual())
		}
	}

	selection() {
		this.mom = this.getFittest();
		this.dad = this.getSecondFittest();
	}

	crossover() {
		const crossOverPoint = randomNumber(0,5);

	}

	getFittest() {

	}

	getSecondFittest() {

	}

	getLeastFittest() {

	}

	calculateFitness() {
		this.individuals.forEach(individual => individual.calcFitness());

		getFittest();
	}
}

Tetris.Genetic.prototype = {

	getMove: function(board, shapes) {
		return Tetris.Heuristics.getBestMove(board, shapes, 0)
	}
}
