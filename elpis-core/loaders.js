const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller');
const serviceLoader = require('./loader/service');
const extendLoader = require('./loader/extend');

module.exports = {
  load(app) {
    middlewareLoader(app);
    routerSchemaLoader(app);
    console.log(app.routerSchema);
    controllerLoader(app);
    serviceLoader(app);
    routerLoader(app);
    extendLoader(app);
  },
};
