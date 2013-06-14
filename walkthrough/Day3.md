Day 3
=====


Today we will create a controller to hook up our various widgets together. In the process, we'll learn a bit more about `wire.js` jargon.

`Wire.js` terminology
---------------------

Since everything in the wire spec is essentially an object, establishing a common language to talk about individual components will be helpful. You can read more about many of these in the [wire.js docs](https://github.com/cujojs/wire/blob/master/docs/concepts.md).

At the top level is the **wire spec** object we provide to `wire.js`. A project however can consist of multiple wire specs. Each spec essentially describes how a set of components interact with each other, what is often referred to as **application composition**. The resulting set of interconnected Javascript object produced by processing a wire spec is called a **context**. Contexts form a hierarchy, as wire specs can have other wire specs as components.

The wire spec is a Javascript object, whose properties (keys) are called **components**. They each represent a small individual part of the application. These components could be extremely simple, like a single string or an array, or more complex, representing some widget, a controller, a model that manages our data through a REST interface, etc. Components can **reference** each other using the `$ref` keyword or sometimes even directly by name.

One of the properties of a component is a keyword that identifies what **factory** to use in order to create this component. Wire.js comes with 5 built-in factories, and **plugins** can provide more. These factories tell wire.js whether it is loading a module (`module`), a constructor function (`create`), function composition (`compose`), another wire spec (`wire`) or a literal object (`literal`). We already used a plugin to add another factory, the `widget` factory, from the `wire/jquery/ui` plugin. Plugins can do other things also, but more on that later.

Other properties of a component object are typically referred to as **facets**. They allow us to configure our component more, and different factories offer us different facets. Again plugins can create new facets.

The final key part of wire specs is **connections**, which are often carried out through facets. Connections are essentially the glue code that connects components together. We have already seen a connection in the form of a `$ref` reference, which is known as *dependency injection*.  Another type of connection is between a DOM event and a component method, achieved via the `wire/on` or `wire/jquery/on` plugin. We will implement some of these today. Next, the `wire/connect` plugin allows connections between pure Javascript components. This can link the execution of certain functions to the execution of other functions. Another important type of connection is **aspect oriented programming**, provided by the wire/aop plugin. This allows us to hook up functions to be executed before, after, or around other functions. Finally, **component transform** connections allow us to transform some data before passing it on. For instance, if clicking a button causes a controller to do something with the text in a text field, a transform can provide that text to the controller, so that the controller does not need to know much about the dom structure. These transform are often offered in the form of **function pipelines**.

Well, that was our (not so) short introduction to the basic concepts related to wire specs. We will now see some of these concepts in action by adding functionality to our interface.

Click that Button!
------------------

We'll start by making the click of the button actually do something. For that we will need to react to on-click events, and we will therefore need the `wire/jquery/on` plugin. So we start by adding that to the `plugins` section of our wire spec. At the same time, we will rename that section to `$plugins`, as that is the now the recommended way to identify plugins.

Before we actually connect our button though, we will first create a controller. For now we will keep the controller in a `controllers` folder, and call it `logging`. It is a very simple module. It uses the standard AMD setup of a `define` call, with a function wrapper in it containing our module. In this case we simply return a constructor function. In wire spec in `app/main.js` we create this new `logging` component, using our `app/controllers/logging.js` module and the `create` factory. It then uses our constructor function to produce a new instance of this object. Notice the `properties` facet, which adds a message to our controller. It is equivalent to us having typed `this.message = 'Wire specs rock!'` in the constructor. This controller we constructed is fairly simple, it has a `logMe` method that logs the message the controller has stored. Going back to our button widget now, which we called `addVariable`, we add an `on` facet to it, which tells it that on a click it should call the `logMe` method of the `logging` component.

And we're done! If you refresh the page, you should be able to now click the button and have the message 'Wire specs rock!' appear in your console.

While we're at it, we will bind one more action to our controller, this time bound to change events in our slider. So when the slider moves, the two slider values are output in the console. This time we will add the `on` facet to the controller instead, like so:

    on: {
    	sliding: {
    		'slidechange': 'newSliderNums'
    	}
    }

Try it out!

Simple DOM elements as components
---------------------------------

Before we finish for the day, we'll make one more change. The `#autocomp` dom node is right now only referred to within the `autocompleter` widget, we'd like to get a direct handle on it. In order to do that, we will use the `element` factory. The corresponding component looks like this:

    textInput: {
    	element: { $ref: 'first!#autocomp' },
    	properties: {
    		value: 'Hello!'
    	}
    },

Note that we can use the shorthand `first!` instead of `dom.first!`, and that we also added a default value to it in the `properties` facet. Finally, in `autocompleter` we changed the reference to refer to this new component instead of the dom directly. We may do more stuff with it later.

Well, this is it for today. Let's sum up:

- We learned the `wire.js` lingo and the broad concept related to wire specs.
- We created a new controller module, and linked it to our widget components.

Next up, we'll work with some models and try to hook them up to that autocomplete widget.