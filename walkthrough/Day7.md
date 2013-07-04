Day 7
=====

We will start getting into more "serious" stuff now, and we will start by creating our first wire plugin. Wire plugins can be used to add new factories, reference resolvers, facets or proxies, and thus enhance wire's basic language. In this instance, we will add a plugin to offer Handlebars support. First we'll need to include Handlebars into our project through, Bower, and we'll do so with the following call:

    bower install require-handlebars-plugin --save

Then we'll add that as a dependency to load in our `run.js`, more specifically as a new package. Note that the package we just installed does a lot more, related to setting up a `require.js` plugin. We may play with the rest of the stuff there later, but for now all we are interested in is the AMD-version of Handlebars included in it, and that is what we linked to in that path.

To see that the installation of Handlebars worked, we'll create a folder `templates` under `app/common`, which will be used later on to store our template modules. For now, we'll add a file called [testHbs2.js](../app/common/templates/testHbs2.js) to test our Handlebars install. You should see a console log now when you load the page.

We now have one way to incorporate Handlebars into our code. One thing is a bit unsatisfactory though, and that is the presence of the template embedded in the module. It would be better if we can load it from a file or something, or ideally not even need to write this module at all. We already know how to load a text file in an AMD setting, using the `text!` plugin. You can see that in action in the template example [testHbs2.js](../app/common/templates/testHbs2.js).

But that's still not entirely satisfactory. We shouldn't really need to create that module in the first place, if at all possible. We should be able to simply do something like this in our wire spec:

    templString: { $ref: 'text!pathToTemplateFile' },
    templFunction: { $ref: 'hbs!templString' }

And then `templFunction` will be the compiled template, that just needs to be fed a json object.

We will try to make that possible now, via our very own plugin!

Plugins yey!
------------

So what is a plugin you ask? At its root, it is nothing more than a module that returns a factory function. So its skeleton would look like this:

    define(['handlebars', function(Handlebars) {
        return function(options) {
            // options provided when the plugin is declared in the wire-spec
            return {
                // Instance specific methods go here
                ...
            }
        }
    })

In that innermost object we can define all the things we want our plugin to do:

- We can provide a `context` object containing methods to be called at various points during a wire-spec's lifecycle.
- We can provide `create`, `configure`, `initialize`, `connect` etc methods to be called during the lifecycle of the spec's components.
- We can provide a `resolver` object with custom reference resolvers. This is what we will be using.
- We can provide a `factories` object for custom factories our plugin provides.
- We can provide a `proxies` object for custom proxies we might want to add. Proxies wrap around component objects, allowing plugins to interact with them in a "safe" way.
- We can provide a `facets` object, for custom facets.

You can find a lot more details at any time at the [docs](https://github.com/cujojs/wire/blob/master/docs/plugins.md). There's a ton of stuff plugins can do, for now we will focus just on a simple plugin that adds a `hbs` reference resolver. We will add our plugin in a `plugins` folder under our app. To hook it up into the application, we need to add it to our wire spec's plugins section.

Our resolver is actually fairly simple, here it is:

    resolvers: {
        hbs: function(resolver, refName, refObj, wire) {
            wire.resolveRef(refName)
                .then(function(template) {
                    resolver.resolve(Handlebars.compile(template));
                })
                .otherwise(function(error) {
                    resolver.reject(error);
                });
        }
    }

We should perhaps explain a few things here. The whole system heavily uses promises. Our function `hbs` is provided with 4 arguments:

- `resolver` is the resolver for the deferred object that represents the task we are asked to do. If that all sounded complicated, then simply know this: Once we have computed our result that we want our reference resolver to achieve, we are supposed to call `resolver.resolve(result)`. If instead we want to signal an error, we do so by calling `resolver.reject(error)`. This resolver is essentially the way we let the system know that we are done with the computation.
- `refName` is simply the text following the `hbs!` call, in other words it's the name of the reference we were supposed to resolve. In our case, we were expecting that to be defined somewhere previously in the spec.
- `refObj` is the entire reference object. This may contain additional options, like Handlebars helpers, that our method should worry about. The above code does not do that yet.
- `wire` is a handle on the current wire context. We use it in our resolver to resolve the `refName` string. As most wire things this returns a promise, and then we use the standard `then` method to attach a handler to be executed when that promise has been resolved. We then turn around, and resolve our promise after passing that result through Handlebars. We catch all errors in the `otherwise` call. See [the when API](https://github.com/cujojs/when/blob/master/docs/api.md) for more info on promises.

We're also adding a `text!` resolver, that works much like when used inside a `module` factory, essentially delegating to the AMD plugin with that name. This allows us to write something like:

    aTemplate: { $ref: 'hbs!text!app/common/templates/templ.hbs' }

Notice how reference resolvers can be chained.

Wrap up
-------

Well we took a first look at wire plugins, and how they can allow us to enhance wire.js's language. There's a ton more that wire.js can do for us, and we'll see some of them later on. For now, let's take a quick rest before delving into more stuff.
