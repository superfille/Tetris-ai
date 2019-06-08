const wait = async(ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const randomInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
}

export {
  wait,
  randomInteger
}