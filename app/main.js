define({

	// Load a basic theme. This is just a CSS file, and since a moduleLoader is
	// configured in run.js, curl knows to load this as CSS.
	theme: { module: 'theme/basic.css' },
	css: { module: 'css!lib/jquery-ui/themes/eggplant/jquery-ui.css' },

	// Create a simple view by rendering html, replacing some i18n strings
	// and loading CSS.  Then, insert into the DOM
	message: {
		render: {
			template: { module: 'text!welcome/template.html' },
			replace: { module: 'i18n!welcome/strings' },
			css: { module: 'css!welcome/structure.css' }
		},
		insert: { at: 'dom.first!#welcome' }
	},

	addVariable: {
		widget: {
			type: 'button',
			node: { $ref: 'dom.first!#myButton' },
			options: {
				text: true,
				label: 'Click me!'
			}
		},
		on: {
			click: 'logging.logMe'
		}
	},
	
	
	flashNote: {
		create: {
			module: 'app/common/flashElement.js',
			args: { $ref: 'first!#autocomp + span' }
		}
	},
	findItem: { module: 'app/common/transform/findItemFromEvent' },
	textInput: {
		element: { $ref: 'first!#autocomp' },
		properties: {
			value: 'Hello!'
		}
	},

	autocompleterList: {
		create: {
			module: 'app/common/stack',
			args: [['John', 'Bill', 'Haris', 'Barb', 'Bob', 'Jack', 'Aardvark']]
		},
		on: {
			textInput: {
				change: 'findItem | pushIfNew'
			}
		},
		after: { 
			push: 'flashNote'
		}
	},
	
	autocompleter: {
		widget: {
			type: 'autocomplete',
			node: { $ref: 'textInput' },
			options: {
				source: { $ref: 'autocompleterList.values' },
				minLength: 0
			}
		}
	},




	sliding: {
		widget: {
			type: 'slider',
			node: { $ref: 'dom.first!#mySlider' },
			options: {
				max: 200,
				range: true,
				values: [40, 70]
			}
		}
	},
    
	logging: {
		create: 'app/controllers/logging',
		properties: {
			message: 'Wire specs rock!'
		},
		on: {
			sliding: {
				'slidechange': 'newSliderNums'
			}
		}
	},
	
	// Wire.js plugins
	$plugins: [
		{ module: 'wire/jquery/dom', classes: { init: 'loading' } },
		{ module: 'wire/dom/render' },
		'wire/jquery/ui', 'wire/jquery/on',
		'wire/aop'
	]
});