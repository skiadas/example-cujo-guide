Day 1
=====

Starting up
-----------

In this first step we will use cujoJS's [seed](https://github.com/cujojs/seed#readme) to kick-start the project. Normally you would follow the links outlined in the above link, but as I've already started a repository I will just [download the zip](https://github.com/cujojs/seed/archive/master.zip) and place the files in this folder.

This just added a whole lot of files to our project, so let's take a look at them:

    app
    |
    |-- main.js
    |-- run.js
    |-- welcome
        |-- strings.js
        |-- structure.css
        |-- template.html
    bower.json
    index.html
    package.json
    theme
    |-- basic.css

So first off we see there is an `app` folder. This folder will contain almost the entire application, and we'll look at it closely. Other than that, there is an `index.html` file that starts everything up, two JSON files that hold package information and that we will examine closely in a moment, and a `theme` folder to hold general theme-related CSS files.

package.json
------------

Every app contains a [package.json](../package.json) file, which manages Node.js-related package settings, as well as information on how to test and run the app. We will start by changing the app's name, version and description, and add some keywords. Then we'll change the repository link, and the maintainer info.

Notice, that the app has no 'dependencies', i.e. there are no npm packages it needs to run. Not entirely unusual for a client-side app. It does however have 2 development dependencies, `serv` and `bower`, we will discuss both of them a bit later. For now we will add version specifications to them. These fields use what is known as [semantic](https://github.com/isaacs/node-semver) [versioning](http://semver.org/).

There are some [scripts](https://npmjs.org/doc/scripts.html) listed there. These are used at various points when [npm](https://npmjs.org) handles our package, and you can see a full list at the corresponding link. For now it is enough to know that `postinstall` is used to download the front-end packages via bower, described below, after all npm packages have been installed, while `start` is a script that would be run when you do `npm start`, and is meant to be a test server for the project.

The `ignore` field is I suppose for folders that should not be included in a distribution, though I have been unable to find documentation for it. Typically this info would go into a `.npmignore` file.

In order to get these development packages loaded, I will run

    npm install

from the main project folder. This will install the development dependencies modules under a `node_modules` folder, and will also create a `components` folder to store bower components, as we'll describe in a moment. As I don't want either of these folders included in my project's repository, I will add them to my `.gitignore` file, which I will have to create first as it does not exist yet. I also have to include there the mac-specific `.DS_STORE` file.

That's it for package.json! We may add things to it as the project evolves. In that case we may need to run `npm install` again.


bower.json
----------

[Bower](https://github.com/bower/bower#bower-) is a front-end package manager, and it should be used to load client side apps. When we ran `npm install` earlier, bower actually went through its install process and downloaded its packages, but we will do so again here for completeness.

Bower uses the file [bower.json](../bower.json) to manage the packages it is meant to, eh, manage. We will change the application name and version number in that file. The format of this file is very similar to `package.json`. The most important part of the file is the `dependencies` field, which lists the packages to be installed. In this instance, it lists the various cujoJS components.

To install the various packages listed in that file, we would run:

    bower install

We don't need to in this case, as our previous `npm install` did that already for us because of the `postinstall` script. You can use this command later however, to install a new package, via:

    bower install <package-name>

You should have a hidden file called `.bowerrc`. If it is not present, you should create it with contents:

    {
    	"directory": "lib"
    }

Then, save that file, completely remove any folder titled `components`, and run `bower install` again. This will make bower use `lib` as its default folder instead of `components`. (Of course you could have simply renamed the `components` folder to `lib`, but this gave us a chance to use `bower install` directly now didn't it?)

serv
----

Our app comes with a built in server, which we can start by running:

    npm start

When you type that, you will see that the terminal window sort of "hangs", allowing you to interrupt the server at any time by pressing `Ctrl-C`. Notice, that the message provides us with a link we can use on our browser to view the page. You should be now welcomed by a very friendly message.

This server simple will be very handy for testing out interface elements.

index.html
----------

Let's take a quick look at our main html file. You will notice that it is extremely minimalistic. It does essentially do 2 things,

1. it sets up what users will be seeing until our javascript app is loaded, and 
2. it loads the necessary javascript files

In almost all cases, there are exactly two script tags that need to be included here:

1. One is the line `<script src="lib/curl/src/curl.js"></script>`, which loads up [curl.js](https://github.com/cujojs/curl). curlJS is a package loader, that is responsible for asynchronously loading all the other javascript packages.
2. The other is the line `<script src="app/run.js"></script>`, that essentially starts the app. We will look into that file closely in a second, it is the place where we tell curlJS what packages to load, where to find them, and what file to execute. It takes care of the rest.

And that's all! the main index file tends to be small in these shorts of apps.


app/run.js
----------

We will now take a closer look at the starter javascript files, starting with `app/run.js`. You will find it in the [app](app/run.js) folder.

Note first of all the wrapper function in line 1, that ends in line 78. It accepts `curl` as an argument, and it is being called passing `curl` to it as an argument. The structure of it is basically as follows:

    var config = {
        // Curl configuration details. Lines 4-36
    }
    curl(config, ['wire!app/main']).then(success, fail);   // Runs the main up
    // Following this, the functions `success` and `fail` are defined, on what to happen 
    // if curl fails to load the files. Lines 41-76

The `config` variable is an object, whose properties `curl` will use to customize itself. First of all it contains a `packages` property, which is an array of the packages to be included, each with the `name` it would be referred to from other parts of the code, and the location where to find the package files. There is also often a reference to the "main" file to access for the module, as modules are often split into multiple little files. We will see most of these packages later, so for now I'll just briefly list them:

- `curl` is the package loader, responsible for loading the packages in the right order.
- `wire` is an "inversion of control container", which fancy talk for the component that is responsible for glueing the different parts of the application together. We will be spending quite a lot of time looking at what wire has to offer.
- `cola` is a data-binding framework, allowing us to automatically bind model components to view parts.
- `when` is a "promises" framework that is used heavily behind the scenes by other components. Promises essentially offer us a way to write our code in a synchronous style, even though it is meant to work asynchronously. Say goodbye to long complicated callback nests.
- `meld` provides what is termed "aspect oriented programming". Effectively this allows us to non-invasively latch on to any existing function, and add code to be executed before or after it, or when it throws an exception etc.
- `poly` offers a convenient way to seamlessly incorporate many of the pre-ECMAScript 5 features, effectively allowing us to run our code in older browsers while benefiting from these features. These kinds of packages are often called "shims".

The other important property in this `config` variable is the `preloads` array, which specifies which packages should be loaded before the other packages. This allows us in this particular instance to use ECMAScript 5 features in our other modules, and rely on the [poly/all](lib/poly) shims to make sure we run on older browsers too. The `preloads` array makes sure those shims will run before the rest of the modules.

The next thing that `run.js` does is to run `curl` with this configuration options, and then ask it to load the file `wire!app/main`. This effectively calls the `wire` package, passing to it the contents of `app/main.js`. We will go into that file more a bit later.

Finally, this call to curl returns a `promise`, provided by the `when.js` package. Promises are objects whose value is promised to be resolved at some point in the future, and they are a very elegant way to approach asynchronous programming. We can latch onto a promise using the `then` method, which is passed two functions, one describing what happens when the promise is resolved, the other describing what happens if the promise is rejected, typically as a result of a thrown exception, for instance if one of the packages isn't found.

Finally, notice that the definitions of the `success` and `fail` functions follow their use. This is possible because Javascript 'hoists' all variable declarations, including functions, to the top of the function they are in. In this particular instance, the two functions would effectively already be declared on line 2 of the file.

app/main.js
-----------

While `app/run.js` simply loaded the necessary packages, it is [app/main](app/main.js) that really kick-starts the application. This file is passed to cujo's [wire.js](https://github.com/cujojs/wire) for interpreting, and it is what is known as a 'wiring spec'. Notice that it is wrapped around a `define` call, making it an AMD module. But while most AMD modules are actual functions that return an object, this spec is in fact an object itself. But it is treated as a thing wire knows how to handle, and not as a regular AMD module.

This is a key file that we will spend much of our time editing in the coming days. Every property in this file essentially provides a component of our app, a model, a controller, a view, a template etc, and the value of that property is in turn an object that tells wire how this component relays to the other components, which methods hook up to where etc. This allows the individual components to be completely agnostic with regards to their relation to the whole; they just focus on the small task they have to perform, and leave the gluing part up to `main.js`.

One first key property there is the `plugins` array. It is a list of the various plugins that need to be included. Plugins allow the wiring spec to do more complex stuff, and we might include some plugins a bit later. For now, notice that `wire` is told to include two plugins it provides, the overall dom manipulation plugin that allows us to hook into DoM elements, and the `wire/dom/render` plugin which provides the means to render forms, used by the `message` element on line 9. [this page](https://github.com/cujojs/wire/wiki/wire-dom) describes the role of the `classes` property, which effectively allows us to attach classes to the `<html>` tag at certain points during the loading process. In this case, the class of the `<html>` tag will be `loading` during initialization. This could be used to turn on or off a message to be shown during the app's loading phase.

Moving to the beginning of the page, a `theme` property is used to refer to the main css file. Notice throughout the `module` properties, used to direct `wire` to the correct files. It resolves these references in part using the `location` properties set in `app/run.js`.

Finally, the only real new thing here is the `message` component. Notice that the files for this component are organized in a folder called `welcome`, which contains information needed to present a welcoming message. That folder consists of 3 files:

1. A `template.html` of the actual html code to be included. Notice the placeholders like `${subheader}` in there. They will be substituted with values coming from:
2. `strings.js`. This is a file telling wire how to substitute in the html. This file can be used to offer the welcome message in the user's native language, though this feature is turned off by default.
3. `structure.css`, providing the structural css instructions required for rendering this html.

Notice how we refer to these 3 files in `main.js`. They are all part of the `render` property of `message`, which tells it how to render itself. And each of them uses a 'plugin' reference in it, those thing that come before the exclamation point. For instance `'text!welcome/template.html'` tells `curl` to load this file as if it were a plain text file instead of a Javascript file, while `'i18n!welcome/strings'` instructs it to use the internationalization module. We may try to play with that a bit in the future. We actually saw this plugin syntax already in `app/run.js`, where it was used to load the wiring spec via the `wire` plugin.

Finally, notice the `insert` property in line 15, which tells `wire` to insert the resulting html into the 'first' 'body' tag in the 'dom'. the `dom.first!` plugin was provided to us via the `wire/dom` module we are including in the spec.

Before we leave this file and finish with our first day of work, keep in mind that a project can have many wiring specs, and they can load each other. We may see examples later on.

The End
-------

Well, this sure was a long day, there was a lot of initial setup that had to be done. The following days will be smaller, and perhaps even more exciting. Our highlights today were:

- Using `package.json` to specify dependencies
- Using `Bower` to manage packages that need to be installed
- The main components required of our `index.html` file.
- Brief outline of the main `cujoJS` components and what they do.
- Using `curl` to load the packages at runtime.
- Using `wire` to set up dependencies between components.
