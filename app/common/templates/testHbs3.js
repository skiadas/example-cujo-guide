define(function() {
    return function(templ, templ2) {
    	console.log(templ({ name: 'John' }));
        console.log(templ2({ name: 'Barb' }));
    }
});
