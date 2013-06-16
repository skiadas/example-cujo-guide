define(function() {
	Stack = function Stack(array) {
		this.values = array || [];
	}
	
	Stack.prototype = {
		push: function(item) { this.values.push(item); return this; },
		pop: function() { return this.values.pop(); },
		last: function() { return this.values[this.length - 1]; },
		length: function() { return this.values.length; },
		isEmpty: function() { return this.length === 0; },
		has: function(item) { return (this.values.indexOf(item) > -1); },
		pushIfNew: function(item) {
			if (!this.has(item)) { this.push(item); }
			return this;
		}
	};
	
	return Stack;
});