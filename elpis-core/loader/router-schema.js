const path = require('path');
const glob = require('glob');
const { sep } = path;
/**
 * router-schema loader
 * @param {object} app
 * json-schema and ajv are restricted to api, along with api-params-verify middleware
 *
 * directory structure: app/router-schema/**.js
 *
 * output:
 * app.routerSchema = {
 *  '${api1}': ${jsonSchema1},
 *  '${api2}': ${jsonSchema2},
 *  ...
 * }
 * 
 *  // directory structure:
 *  app/
      router-schema/
        user/
          login.js    # output { '/user/login': { ...schema } }
          profile.js  # output { '/user/profile': { ...schema } }
        product/
          list.js    # output { '/product/list': { ...schema } }
    // file content example:
    // app/router-schema/user/login.js
      module.exports = {
        '/user/login': {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['username', 'password']
        }
      };
    // loader output:
      app.routerSchema = {
        '/user/login': {
          type: 'object',
          properties: { ... },
          required: [ ... ]
        },
        '/user/profile': { ... },
        '/product/list': { ... }
      };
 */
module.exports = (app) => {
  // read path app/router-schema/**/**.js all files
  const routerSchemaPath = path.resolve(
    app.businessPath, // ./app
    `.${sep}router-schema`
  );
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`)
  );

  const routerSchema = {};

  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });

  app.routerSchema = routerSchema;
};
