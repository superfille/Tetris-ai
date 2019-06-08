import Chromosome from "./new-ai/chromosome";
import Heuristic from "./new-ai/heuristics";

const heu: Heuristic = new Heuristic({ height: 0.510066, completedLines: 0.760666, holes: 0.35663, bumpiness: 0.184483 });
const chromo = new Chromosome(heu);

chromo.play(0, 10).then(console.log)

// const game = new Game(false);