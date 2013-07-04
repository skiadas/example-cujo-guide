define(['handlebars'], function(Handlebars) {
	var templ = Handlebars.compile("Hi {{name}} once!!");
	console.log(templ({ name: 'Haris' }));
});
