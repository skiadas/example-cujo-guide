define(function() {
	return function(template) {
		return function replaceMessageInTemplate(message) {
			return template.replace(/(^|[^\\])(\$message)/g, function ($0, $1) {
				return $1 + message; 
			});
		}
	}
});