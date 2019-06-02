const randomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomInteger = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min) + min);
}

const holeUp = async(ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export {
	randomNumber,
	randomInteger,
	holeUp
}