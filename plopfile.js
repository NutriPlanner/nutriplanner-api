module.exports = function (plop) {
    plop.setGenerator('module', {
        description : 'generates a new module',
        prompts     : [
            {
                type    : 'input',
                name    : 'name',
                message : 'module name',
            },
            {
                type    : 'input',
                name    : 'version',
                message : 'version number',
            },
        ],
        actions: [
            {
                type         : 'add',
                path         : 'src/routes/v{{version}}/{{camelCase name}}.route.js',
                templateFile : 'plop-templates/module/route.hbs',
            },
            {
                type     : 'modify',
                path     : 'src/routes/v{{version}}/index.js',
                pattern  : /(\/\/ ROUTE IMPORT)/g,
                template : "$1\nconst {{camelCase name}}Route = require('./{{camelCase name}}.route');",
            },
            {
                type         : 'modify',
                path         : 'src/routes/v{{version}}/index.js',
                pattern      : /(\/\/ ROUTE REGISTRATION)/g,
                templateFile : 'plop-templates/module/route.registration.hbs',
            },
            {
                type         : 'add',
                path         : 'src/validations/{{camelCase name}}.validation.js',
                templateFile : 'plop-templates/module/validation.hbs',
            },
            {
                type         : 'add',
                path         : 'src/models/{{camelCase name}}.model.js',
                templateFile : 'plop-templates/module/model.hbs',
            },
            {
                type     : 'modify',
                path     : 'src/models/index.js',
                pattern  : /(\/\/ MODEL IMPORT)/g,
                template : "$1\nmodule.exports.{{pascalCase name}} = require('./{{camelCase name}}.model')",
            },
            {
                type         : 'add',
                path         : 'src/controllers/{{camelCase name}}.controller.js',
                templateFile : 'plop-templates/module/controller.hbs',
            },
            {
                type         : 'add',
                path         : 'src/services/{{camelCase name}}.service.js',
                templateFile : 'plop-templates/module/service.hbs',
            },
            {
                type     : 'modify',
                path     : 'src/services/index.js',
                pattern  : /(\/\/ SERVICE IMPORT)/g,
                template : "$1\nmodule.exports.{{camelCase name}}Service = require('./{{camelCase name}}.service');",
            },
            {
                type     : 'modify',
                path     : 'src/utils/InternalCode.js',
                pattern  : /(\/\/ MODULE INTERNAL CODE)/g,
                template : "$1\n  {{constantCase name}}__UPDATE__NOT_FOUND: '{{constantCase name}}__UPDATE__NOT_FOUND',",
            },
            {
                type     : 'modify',
                path     : 'src/utils/InternalCode.js',
                pattern  : /(\/\/ MODULE INTERNAL CODE)/g,
                template : "$1\n  {{constantCase name}}__DELETE__NOT_FOUND: '{{constantCase name}}__DELETE__NOT_FOUND',",
            },
        ],
    } )
}
