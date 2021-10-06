import Noty from 'noty';

export default function notify({ type = 'error', text }) {
	new Noty({
		theme: 'metroui',
		text,
		type: type,
		timeout: 3000,
		layout: 'bottomRight',
		progressBar: false
	}).show();
}
