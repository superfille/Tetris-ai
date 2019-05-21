import Chromosome from "./Chromosome";
import Heuristic from "./Heuristics";
import { randomInteger } from "../Utils";

export default class Genetic {
  population: Chromosome[];

  crossover(mother: Chromosome, father: Chromosome): Chromosome {
    const heuristics = new Heuristic();
    heuristics._height = mother.fitnessHeight() + father.fitnessHeight();
    heuristics._completedLines = mother.fitnessCompletedLines() + father.fitnessCompletedLines();
    heuristics._holes = mother.fitnessHoles() + father.fitnessHoles();
    heuristics._bumpiness = mother.fitnessBumpiness() + father.fitnessBumpiness();
    heuristics.normalize();

    return new Chromosome(heuristics);
  }

  sortPopulation(population: Chromosome[]) {
    population.sort((a, b) => a.fitness - b.fitness);
  }

  initializePopulation(population: Chromosome[], amount: number) {
    for (let index = 0; index < amount; index++) {
      population.push(new Chromosome());
    }
  }

  tournamentSelection(candidates: Chromosome[], ways: number) {
    const indices = Array.apply(null, {length: candidates.length})
      .map(Number.call, Number);

    var fittestCandidateIndex1 = null;
    var fittestCanddiateIndex2 = null;
    for (var i = 0; i < ways; i++){
      var selectedIndex = indices.splice(randomInteger(0, indices.length), 1)[0];
      if(fittestCandidateIndex1 === null || selectedIndex < fittestCandidateIndex1){
        fittestCanddiateIndex2 = fittestCandidateIndex1;
        fittestCandidateIndex1 = selectedIndex;
      } else if (fittestCanddiateIndex2 === null || selectedIndex < fittestCanddiateIndex2){
        fittestCanddiateIndex2 = selectedIndex;
      }
    }
    return [candidates[fittestCandidateIndex1], candidates[fittestCanddiateIndex2]];
  }

  deleteNLastReplacement(population: Chromosome[], newCandidates: Chromosome[]){
    population.splice(-newCandidates.length);
    population.push(...newCandidates);
    
    this.sortPopulation(population);
  }

  computeFitnesses(population: Chromosome[], numberOfGames: number, maxNumberOfMoves: number) {
    for (let i = 0; i < population.length; i++) {
      let totalScore = 0;
      for (let j = 0; j < numberOfGames; j++) {
        // console.time('starting');
        totalScore += population[i].play(maxNumberOfMoves);
        // console.timeEnd('starting')
      }
      population[i].fitness = totalScore;
    }
  }

  async playAsync() {
    this.population = [];
    this.initializePopulation(this.population, 10);
    this.population[0] = new Chromosome(new Heuristic({ completedLines: 0.760666, height: 0.510066, holes: 0.35663, bumpiness: 0.184483 }));

    try {
      await this.population[0].playAsync();
      console.log('Fitness: ', this.population[0].fitness);
    } catch (error) {
      console.error(error)
    }
  }

  play() {
    // Initial population generation
    this.population = [];
    this.initializePopulation(this.population, 10);
    console.log('Computing fitnesses of initial population...');

    this.computeFitnesses(this.population, 5, 200);
    this.sortPopulation(this.population);

    console.log('Fittest candidate = ', this.population[0].toString());
    console.log(`Score = ${this.population[0].fitness}`);

    var count = 0;
    while (count < 50) {
      var newCandidates = [];
      for (var i = 0; i < 30; i++) {
        var pair = this.tournamentSelection(this.population, 2);
        var candidate = this.crossover(pair[0], pair[1]);
        if (Math.random() < 0.05) {
            candidate.mutate();
        }
        candidate.normalize()
        newCandidates.push(candidate);
      }

      console.log('Computing fitnesses of new candidates. (' + count + ')');
      this.computeFitnesses(newCandidates, 5, 200);
      this.deleteNLastReplacement(this.population, newCandidates);
      
      console.log(`Fittest candidate = ${this.population[0].toString()}`);
      console.log(`Score = ${this.population[0].fitness}`);
      count++;
    }

    console.log('Done')
  }
}