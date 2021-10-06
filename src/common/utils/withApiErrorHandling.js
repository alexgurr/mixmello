import notify from './notify';

export default function withApiErrorHandling(fn) {
	return async (...args) => {
		try {
			const res = await fn(...args);
			
			return res;
		} catch {
			notify({ text: 'Hmm, something went wrong. Why not give it another try?' });
			
			throw new Error();
		}
	}
}