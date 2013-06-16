Day 4
=====

Day 4 is already here, and we will now set out to create some simple models. There are more advanced methodologies to use, but the low tech approaches we'll take will get us more use to how wire specs work.

We will start by creating a simple 'stack' component, with just a few more bells and whistles. Internally the component will be just an array, with a few exposed methods. Then we will tie that component to the list provided by the autocompleter, and make typing new words in the input field add them to the stack.

A stack module
--------------

We'll first create a folder `app/common` to hold such common components. In it we'll create a new module, called `stack.js`, that returns a constructor for our stacks. The [whole file](../app/common/stack.js) is no more than 10 lines, as the Array class does most of the work for us.

Nest we'll create a component in our `wire spec`, instantiating this stack, and initializing it with an array of values. We will create it close to the `autocompleter` component for ease of reach. We then link the `source` property of the `autocompleter` widget to this new stack with:

    source: { $ref: 'autocompleterList.values' }

We'll now go back to our website and verify that the autocomplete list still works (it does).

We now want to set it up, so when the user has typed something in the input and presses Enter, that item will be added to the stack if it doesn't already exist there. In order to achieve that, we will need a couple of things:

1. A new `pushIfNew` method on the stack object, that only pushes in a new item if it doesn't already exist in the stack.
2. A hook on the `change` [jQuery event](http://api.jquery.com/change/) of our input field.
3. A `getValue` 'transform function' that from the change event pulls out the field's value.

Let's get started. The pushIfNew method if fairly straightforward, and it looks like this:

    pushIfNew: function(item) {
    	if !this.has(item) { this.push(item); }
    	return this;
    }

Next up we create a new function, `findItemFromEvent`, and place it as a module under [app/common/transform](../app/common/transform). It simply reads off the value of the target of the event and returns it. We then hook it into our wire spec by creating a new component, `findItem`, based off this file.

Finally, to hook this up with the change event of the input field, we use the `on` facet. There are multiple places we could have placed it, but we chose to put it in the `autocompleterList` component, like so:

    on: {
    	textInput: {
    		change: 'findItem | pushIfNew'
    	}
    }

This syntax says that when the `change` event happens on `textInput`, it should call `findItem` and pass it the event, then pass the result of that call to `pushIfNew`.

You can try it out now and see how it works, except we have to somehow prevent the form event from kicking in when we press Enter. We did that now in a brute force way, but changing the form field to have a `return false;` handler in its `onsubmit` method. Ideally we should be handling that also in our wire spec.

End of Day 4!
-------------

Well folks, this is it for day 4, we'll try to keep the days short for a while, as we walk through these key interaction patterns. Here's what we did today:

1. Created a simple stack model to hold the array of values used for the auto-completions.
2. Hooked up the input field to feed its value when appropriate to the autocomplete list for inclusion to the array.
3. We learned how to create tiny utility 'transform' functions to manipulate the data as it moves from one component to the next.

These components would more or less give us all we need to create a `categorical variable` interface. The autocomplete feature will keep track of already selected values, so the user can quickly select one of the existing values, otherwise what the user types creates a new value. What we are missing of course is a way to type in a whole array of values, instead of just one. But one step at a time.