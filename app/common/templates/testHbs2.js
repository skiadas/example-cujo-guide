define(['handlebars', 'text!app/common/templates/templ.hbs'], function(Handlebars, templ) {
	var templ = Handlebars.compile(templ);
	console.log(templ({ name: 'Haris' }));
});
