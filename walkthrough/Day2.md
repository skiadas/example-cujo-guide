Day 2
=====

It's time for day 2! Our first goal for today will be easy: To use `wire.js` to hook up a button that adds a little text to the screen. We will call it our 'add' button, since it would be used for adding new variables later on. This will get us used to some of the ways `wire.js` operates.

Setting up jQuery UI
--------------------

We will be using [jQuery UI](http://jqueryui.com/) widgets, and in particular the button widget. `Wire.js` already has an implementation for these via a [plugin](https://github.com/cujojs/wire/blob/master/docs/jquery.md#jquery-ui-widgets), so we will just load and use that. In order to do that however, we need to update our `wire` module to its newer version, as the jQueryUI support was [introduced in version 0.10](https://github.com/cujojs/wire#whats-new), and we're using 0.9. We will therefore change the 0.9 to 0.10 as the value for `wire` in `bower.json`, and then run `bower update` from the command line to update. While we're at it, we'll update the numbers any other dependencies that have newer versions. Keep in mind that you don't necessarily want to always do that, as newer versions might break something you were relying on somewhere in your code. Since we haven't done anything yet though, there's not much harm done by updating them all.

We also need to add jQuery and jQuery UI to the mix now, as our package loader, `curl`, doesn't know about them yet. We'll need to add them to `bower.json` as dependencies, and add them in `app/run.js` as packages to load. You will likely need to run `bower install`.

Installing jQuery gets a bit tricky, as we have to add a `paths` variable for it in `app/run.js` instead of putting it as a package, partly because a lot of plugins expect to find it available globally, instead of as AMD. jQueryUI on the other hand just needs to be installed as a package in `app/run.js`.

Moving on to our wiring spec in `app/main.js`, we need to add two plugins to it. One is a 'dom' plugin using jquery, which will replace our previous dom plugin, and the other is a plugin for access to the jQueryUI elements. This second plugin offers us with a `widget` 'facet', which we will use to create the button, or any other UI element.

Finally, jQueryUI needs us to choose a css theme, either one of the themes available with it or your own. All you need to do really is include the css file as part of our wiring spec. I have done this on line 6 of [app/main.js](app/main.js).

Creating the Button
-------------------

In order to create this button, or any other aspect of the UI really, we just need to add the correct component to our wiring spec, by adding a property to it. We do this in lines 19-28 of `app/main.js`, naming the new component `addVariable`. Looking at the [button widget's API](http://api.jqueryui.com/button/) we can see what properties we might need to set, and an example to base our work on is provided [here](https://github.com/cujojs/wire/blob/jquery-ui/docs/jquery.md).

First off, there is a `type` we need to set, in this case 'button' since we are creating a single button for starters. We also need to specify a 'node'. We created a new input element in our `index.html` for this purpose, and gave it an id. We then use the `{ $ref: 'dom.first!#myButton' }` convention for reference the first occurrence of this button in the dom. These two are the essential components. From there on, we can set some options, based on the options provided by the widget's API. In this case we set the 'text' property to `true` to make the button have text on it, and provided a 'label' property with the value for this text.

For now we'll leave the button at that. It doesn't do much at the moment, we'll need to bind some utility later. In the meantime, let's practice this more by adding another widget from the jQueryUI gallery, for instance the `autocomplete` widget. In order to do this, we will first need to create an appropriate input element in our index.html file. Then we add the widget specification into our wiring spec, in lines 30-39. The key option to specify there is the 'source', pointing to an appropriate source for the list of values to autocomplete by. The API follows a clear description of the wonderful possibilities.

Finally, let us create a slider. The process will be very similar, with an html element in our `index.html` and a corresponding component in our wiring spec. We'll worry about its looks later.

A note on all this. There are probably better ways to structure this whole thing, but we will worry about them later. For now, we're trying to get comfortable with some basic functionality.

The End. For now
----------------

Well that was probably enough for a day, we took it light. But we did accomplish two important goals:

- Hooked up jQuery and jQueryUI.
- Included widgets into our wiring spec.

Next time, we'll need to look more into making those widgets do stuff for us. Till next time!
