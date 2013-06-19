Day 6
=====

When a new item is added to the autocompleter list, a message flashes on the screen. Today our goal will be to isolate this message into a separate customizable component. Here's what this component does:

It is given a node element to place the message relative to, a duration for the effect, and optionally whether the message is meant to be appended next to the element, or placed at the end of the element. It then produces a function, which when called with a message string will flash that message on the screen. We will then separately create a new transform function, which accepts a template input and returns a function that will take a given message and pass it through the template. This will allow us to produce somewhat richer messages.

Let us begin.

flashMessage
------------

The first ingredient will be our `flashMessage` method. We will place it under an [app/common/effect](../app/common/effect) folder, and name it `flashMessage`. The code is somewhat verbose, but if you look at it, you will find that the constructor takes at most 3 arguments:

- An element to work with
- A duration for the effect
- A boolean determining whether the message is to be appended after or to the element.

It then returns a function, that expects a message and then flashes that message on a newly created element, and then destroys that element.

We will create a component from that module in our spec with something like this:

    flashNote: {
    	create: {
    		module: 'app/common/effect/flashMessage',
    		args: [
    			{ $ref: 'first!#autocomp' },
    			2000
    		]
    	}
    }

The passed message is allowed to be a already created dom node, in which case it is used as is.

createNote
----------

Normally this `flashNote` method would have been passed the item name. We instead would like to see a better message from it, so we'll utilize a transform for that purpose. We will call our transform `verySimpleTemplate`, and place it under [app/common/transform](../app/common/transform/verySimpleTemplate.js).

This transform takes a template as input, and returns a function that will accept a string and substitute that string for `$message` in the template. We then add it to our spec like so:

    createNote: {
    	create: {
    		module: 'app/common/transform/verySimpleTemplate',
    		args: ['Added "$message" to the list!']
    	}
    },

wiring everything up
--------------------

We will connect this flash message to our stack's `push` method, but this time we will use the `wire/connect` plugin instead. This allows us to bind a method to be called when `push` is called, and to be passed the same arguments. So our method will be receiving the name of the item to be included. Before flashing it on the screen, we will pass it through our `createNote` transform first:

    connect: { 
    	push: 'createNote | flashNote.flash'
    }

Before we wrap up, we'll go ahead and remove the old `flashElement` script that is no longer being used.

Day 6 end
---------

Today we got to practice a bit more creating components, and connecting functions and events at appropriate times. Next up we'll start building our proper 'Variable' components. We will likely need to create custom wire specs for them, but we will hopefully get to reuse some of these components.
