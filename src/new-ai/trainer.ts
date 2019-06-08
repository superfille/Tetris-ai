// import Chromosome from "./chromosome";
// import Heuristic from "./heuristics";
// import { randomInteger } from "../Utils";

// export default class Trainer {
//   population: Chromosome[];
  
//   crossover(mother: Chromosome, father: Chromosome): Chromosome {
//     const heuristics = new Heuristic();
//     heuristics.height = mother.fitnessHeight() + father.fitnessHeight();
//     heuristics.completedLines = mother.fitnessCompletedLines() + father.fitnessCompletedLines();
//     heuristics.holes = mother.fitnessHoles() + father.fitnessHoles();
//     heuristics.bumpiness = mother.fitnessBumpiness() + father.fitnessBumpiness();
//     heuristics.normalize();

//     return new Chromosome(heuristics);
//   }

//   sortPopulation(population: Chromosome[]) {
//     population.sort((a, b) => b.fitness - a.fitness);
//   }

//   initializePopulation(population: Chromosome[], amount: number) {
//     for (let index = 0; index < amount; index++) {
//       population.push(new Chromosome());
//     }
//   }

//   tournamentSelection(candidates: Chromosome[], ways: number) {
//     const indices = Array.apply(null, {length: candidates.length})
//       .map(Number.call, Number);

//     var fittestCandidateIndex1 = null;
//     var fittestCanddiateIndex2 = null;
//     for (var i = 0; i < ways; i++){
//       var selectedIndex = indices.splice(randomInteger(0, indices.length), 1)[0];
//       if(fittestCandidateIndex1 === null || selectedIndex < fittestCandidateIndex1){
//         fittestCanddiateIndex2 = fittestCandidateIndex1;
//         fittestCandidateIndex1 = selectedIndex;
//       } else if (fittestCanddiateIndex2 === null || selectedIndex < fittestCanddiateIndex2){
//         fittestCanddiateIndex2 = selectedIndex;
//       }
//     }
//     return [candidates[fittestCandidateIndex1], candidates[fittestCanddiateIndex2]];
//   }

//   deleteNLastReplacement(population: Chromosome[], newCandidates: Chromosome[]){
//     population.splice(-newCandidates.length);
//     population.push(...newCandidates);
    
//     this.sortPopulation(population);
//   }

//   computeFitnesses(population: Chromosome[], numberOfGames: number, maxNumberOfMoves: number) {
//     for (let i = 0; i < population.length; i++) {
//       let totalScore = 0;
//       for (let j = 0; j < numberOfGames; j++) {
//         totalScore += population[i].play(maxNumberOfMoves);
//       }
//       population[i].fitness = totalScore;
//     }
//   }

//   async playAsync(data: {height: number, completedLines: number, holes: number, bumpiness: number}) {
//     this.population = [];
//     this.initializePopulation(this.population, 10);

//     this.population[0] = new Chromosome(new Heuristic(data));

//     try {
//       await this.population[0].playAsync();
//       console.log('Fitness: ', this.population[0].fitness);
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   play() {
//     // Initial population generation
//     this.population = [];
//     this.initializePopulation(this.population, 100);
//     console.log('Computing fitnesses of initial population...');

//     this.computeFitnesses(this.population, 5, 200);
//     this.sortPopulation(this.population);

//     console.log('Fittest candidate = ', this.population[0].toString());
//     console.log(`Score = ${this.population[0].fitness}`);

//     var count = 0;
//     while (count < 50) {
//       var newCandidates = [];
//       for (var i = 0; i < 30; i++) {
//         var pair = this.tournamentSelection(this.population, 10);
//         var candidate = this.crossover(pair[0], pair[1]);
//         if (Math.random() < 0.05) {
//             candidate.mutate();
//         }
//         candidate.normalize()
//         newCandidates.push(candidate);
//       }

//       console.log('Computing fitnesses of new candidates. (' + count + ')');
//       this.computeFitnesses(newCandidates, 5, 200);
//       this.deleteNLastReplacement(this.population, newCandidates);
      
//       console.log(`Fittest candidate = ${this.population[0].toString()}`);
//       console.log(`Score = ${this.population[0].fitness}`);
//       count++;
//     }

//     console.log('Done')
//   }
// }