export default function postEvent(event) {
	// eslint-disable-next-line no-undef
	if (!gtag) { return; }
	
	try {
		// eslint-disable-next-line no-undef
		gtag('event', event, { value: 1 });
	} catch {}
}