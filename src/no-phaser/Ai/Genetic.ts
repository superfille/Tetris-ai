import Chromosome from "./Chromosome";
import Heuristic from "./Heuristics";
import { randomInteger } from "../../Utils";

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
    population.sort((a, b) => a._fitness - b._fitness);
  }

  initializePopulation(population: Chromosome[], amount: number) {
    for (let index = 0; index < amount; index++) {
      population.push(new Chromosome())
    }
  }

  tournamentSelection(candidates: Chromosome[], ways: number){
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
    for(var i = 0; i < population.length; i++){
      const candidate: Chromosome = population[i];
      var totalScore = 0;
      for(var j = 0; j < numberOfGames; j++){
        candidate.play();
        totalScore += candidate.fitness();
      }
      candidate.setFinalFitness(totalScore);
      console.log('Final fitness of a chromosome', candidate.finalFitness());
    }
}
  async playAsync() {
    this.population = [];
    this.initializePopulation(this.population, 10);
    this.population[0] = new Chromosome(new Heuristic({ completedLines: 0.760666, height: 0.510066, holes: 0.35663, bumpiness: 0.184483 }));
    try {
      await this.population[0].playAsync();
      console.log('Fitness: ', this.population[0]._fitness);
    } catch (error) {
      console.error(error)
    }
  }

  play(){
    // Initial population generation
    this.population = [];
    this.initializePopulation(this.population, 10);
    console.log('Computing fitnesses of initial population...');
    this.computeFitnesses(this.population, 10, 200);
    this.sortPopulation(this.population);

    var count = 0;
    while(true){
        var newCandidates = [];
        for(var i = 0; i < 3; i++) {
            var pair = this.tournamentSelection(this.population, 2);
            var candidate = this.crossover(pair[0], pair[1]);
            if(Math.random() < 0.05){
                candidate.mutate();
            }
            candidate.normalize()
            newCandidates.push(candidate);
        }
        console.log('Computing fitnesses of new candidates. (' + count + ')');
        this.computeFitnesses(newCandidates, 10, 200);
        console.log('Population size before: ', this.population.length);
        this.deleteNLastReplacement(this.population, newCandidates);
        console.log('Population size after: ', this.population.length);
        const totalFitness = this.population.reduce((prev, acc) => prev + acc.fitness(), 0);
        
        console.log('Average fitness = ' + (totalFitness / this.population.length));
        console.log('Highest fitness = ' + this.population[0].fitness() + '(' + count + ')');
        console.log('Fittest candidate = ' + JSON.stringify(this.population[0]) + '(' + count + ')');
        count++;
    }
};
}