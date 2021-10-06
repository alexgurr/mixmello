import Noty from 'noty';

export default function notify({ isSuccess, text }) {
	new Noty({
		theme: 'metroui',
		text,
		type: isSuccess ? 'success' : 'error',
		timeout: 3000,
		layout: 'bottomRight'
	}).show();
}
