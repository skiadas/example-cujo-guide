define(['handlebars', 'when'], function(Handlebars, when) {
    return function(options) {
        // options provided when the plugin is declared in the wire-spec
        // We might allow registering handlers here perhaps.
        return {
            // Instance specific methods go here
            resolvers: {
                hbs: function(resolver, refName, refObj, wire) {
                    wire.resolveRef(refName)
                    .then(function(template) {
                        resolver.resolve(Handlebars.compile(template));
                    })
                    .otherwise(function(error) {
                        resolver.reject(error);
                    });
                },
                text: function(resolver, refName, refObj, wire) {
                    wire.loadModule('text!' + refName).then(function(template) {
                        resolver.resolve(template)
                    }, function(error) {
                        resolver.reject(error)
                    });
                }
            }
        }
    }
});
