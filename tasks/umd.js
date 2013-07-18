var extend = require('util')._extend;

var handlebars = require('handlebars');


module.exports = function(grunt) {

    grunt.registerMultiTask('umd', 'Surrounds code with the universal module definition.', function() {
        try{
            verifyArguments(this.data);
        }
        catch (error) {
            grunt.warn(error, 3);
        }

        var tpl = handlebars.compile(grunt.file.read('./templates/umd.hbs'));
        var code = grunt.file.read(this.data.src);
        var output = generateOutput(tpl, code, this.data);

        grunt.file.write(this.data.dest || this.data.src, output);
        return true;
    });

};

var verifyArguments = function(options) {
    if (!options.src) {
        throw new Error("Missing source file (src).");
    }

    if (!options.objectToExport) {
        throw new Error("Missing name of object to export (objectToExport).");
    }

    if (!options.globalAlias) {
        throw new Error('Missing name of global alias (globalAlias)');
    }
};

var generateOutput = function(template, code, options) {
    var ctx = extend({}, options);
    var deps = options.dependencies || [];

    ctx.dependencies = deps.join(', ');
    ctx.amdDependencies = deps.map(wrap("'", "'")).join(', ');
    ctx.cjsDependencies = deps.map(wrap("require('", "')")).join(', ');
    ctx.globalDependencies = deps.map(wrap('root.')).join(', ');
    ctx.code = code;

    return template(ctx);
};

var wrap = function(pre, post) {
    pre = pre || '';
    post = post || '';

    return function(v) {
        return pre + v + post;
    };
};
