Day 5
=====

Today we will delve into an example of [aspect oriented programming](https://github.com/cujojs/wire/blob/master/docs/connections.md#aspect-oriented-programming-aop). Essentially what this means is that we can non-invasively hook up (inject) methods to be executed before or after other methods, or even 'around' other methods. In this instance we will use this to arrange for a simple notification message to appear for a few seconds (flash) when a new item is added to the autocomplete list.

After advice
------------

These methods that we inject are often called 'advices', so in this instance we will use an 'after advice'. The first thing we will need for that is a new plugin, 'wire/aop'.

Next we'll create the ui element for the message to show. We will use a simple `<span>` element for that, and for now we will place it straight into our [index.html](../index.html).

Now, we need to hook into the method that is adding elements into our `autocompletionList`, namely its push method. We will do this in a `after` facet. But first, we're going to need a function to call. We will create a new component for that, called flashElement. This will be based on a factory function, i.e. the module on which it is defined returns a factory function that expects the element to be 'flashed' as input, with an optional duration, and returns a function that will do the flashing. We will place that under the `app/common` folder. This method is [worth looking at](../app/common/flashElement.js), as it shows how to require modules, in this case jquery, in your modules.

Now that the function we need is in place, we need to hook it up in our wire spec. We'll create a new component like so:

    flashNote: {
    	create: {
    		module: 'app/common/flashElement.js',
    		args: { $ref: 'first!#autocomp + span' }
    	}
    },


Notice two things:

1. We used `create` instead of `module` because the return value of `flashElement` isn't the function we want, it is a *factory* for the function we want, similar to a constructor. The `create` factory does exactly that, calls that factory function with the specified arguments, and returns the result, which is the function named `flasher` in the code.
2. The `create` factory allows us to pass arguments to that module's main function, in the form of the `args` property. In it we use the dom *adjacent sibling* selector to pick the `span` that follows element with id `autocomp`.

Now that we have a component that flashes the note we want, we need to hook it up to execute right after a new item is pushed to the array. We will do that by adding an `after` *facet* to our `autocompleterList` model:

    after: { 
    	push: 'flashNote'
    }

This instructs wire to execute the component/method `flashNote` right after `autocompleterList`'s `push` method is executed, and to pass it the result of that push method. That part isn't going to be too helpful to us yet, though we will later change that message to show the item included, and generalize our flashElement factory method to accept a custom template for the text to show, in addition to the element to be used. We will get our first glimpse at rendering templates at that point.

End of Day 5
------------

Well, another short day, but we did get to see two new things:

1. Using a function factory as a module, using `create` and passing arguments to it via `args`.
2. Using *Aspect Oriented Programming* and the `wire/aop` plugin to have a function execute after, before, or around another function.

Next up, we'll create a small separate component for these flash messages, that adjusts its message based on values passed to it, and destroys itself once the messaging is done.
