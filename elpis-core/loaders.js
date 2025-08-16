const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller');
const serviceLoader = require('./loader/service');
const extendLoader = require('./loader/extend');
const configLoader = require('./loader/config');

module.exports = {
  load(app) {
    middlewareLoader(app);
    console.log(`-- [start] middlewareLoader done --`);

    serviceLoader(app);
    console.log(`-- [start] serviceLoader done --`);

    controllerLoader(app);
    console.log(`-- [start] controllerLoader done --`);

    extendLoader(app);
    console.log(`-- [start] extendLoader done --`);

    configLoader(app);
    console.log(`-- [start] configLoader done --`);

    routerSchemaLoader(app);
    console.log(`-- [start] routerSchemaLoader done --`);

    // load global middleware
    try {
      require(`${app.businessDir}${sep}middleware.js}`)(app);
      console.log(`-- [start] load global middleware done`);
    } catch (error) {
      console.log(`[execption] global middleware.js not found`);
    }

    // register router(load middleware before loading router)
    routerLoader(app);
    console.log(`-- [start] routerLoader done --`);
  },
};
