define(['jquery'], function($) {
	return function factory(element, duration) {
		duration = duration || 2000; // 2 seconds
		var el = $(element);  // Ensure we got a jQuery element
		return function flasher() {
			el.show('fade', 100);
			setTimeout(function() { el.hide('fade', 100); }, duration);
		}
	}
});