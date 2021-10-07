import { useState } from 'react';

export default function useNumberFlow({ initialNumber = 0, max, min = 0, increment = 1 } = {}) {
	const [currentNumber, setCurrentNumber] = useState(initialNumber || min || 0);
	const atCeiling = max && (currentNumber + increment > max);
	const atFloor = currentNumber - increment < min;
	
	const onNext = () => {
		if (atCeiling) { return; }
		
		setCurrentNumber(currentNumber + increment);
	};
	
	const onPrevious = () => {
		if (atFloor) { return; }
		
		setCurrentNumber(currentNumber - increment);
	};
	
	return {
		next: onNext,
		previous: onPrevious,
		number: currentNumber,
		atCeiling,
		atFloor,
		setNumber: setCurrentNumber
	}
}