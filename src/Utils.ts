const randomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomInteger(min: number, max: number){
	return Math.floor(Math.random() * (max - min) + min);
}

export {
	randomNumber,
	randomInteger
}