define(function() {
	return function() {
		this.logMe = function() { console.log(this.message); };
		this.newSliderNums = function(el, ui) { console.log('New vals: ', ui.values); }
		return this;
	}
});