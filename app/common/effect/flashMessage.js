define(['jquery'], function($) {
	// Creates a function that will be passed a message and will flash that message.
	// If `after` is `true`, it will insert the message right after `element`.
	// otherwise it will insert the message as the last child of `element`.
	return function factory(element, duration, after) {
		duration = duration || 2000; // 2 seconds
		element = element || $('body');
		after = after || true;
		return {
			flash: function(message) {
				var el = ((typeof message === 'string') ?
					$('<span>' + message + '</span>') :
					$(message))
				el.myFun = after ? el.insertAfter : el.appendTo;
				el.hide().myFun(element).show('fade', 200);
				setTimeout(function() {
					el.hide('fade', 200, function() {
						el.remove();
						el = null;
					});
				}, duration);
				return message;
			}
		}
	}
});