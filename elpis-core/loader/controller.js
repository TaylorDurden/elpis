const path = require('path');
// compatibility for different OS path '/'
const { sep } = path;
const glob = require('glob');
/**
 * controller loader
 * @param {*} app Koa instance
 *
 * This module is responsible for loading all controllers into the Koa application.
 * For example,
 * app/
 *   controller/
 *      auth/
 *        jwt-controller.js
 *      utils/
 *        request-controller.js
 *
 * Output:
 * app.middlewares = {
 *   auth: {
 *     jwtController: require('./app/controller/auth/jwt-controller.js')(app)
 *   },
 *   utils: {
 *     requestController: require('./app/controller/utils/request-controller.js')(app)
 *   }
 * };
 */
module.exports = (app) => {
  // read all files app/controller/**/**.js
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
  const fileList = glob.sync(
    path.resolve(controllerPath, `.${sep}**${sep}**.js`)
  );

  const controller = {};

  fileList.forEach((file) => {
    // 提取文件名称
    let fileName = path.resolve(file);

    // substring path app/controller/custom-module/custom-controller.js => custom-module/custom-controller
    // remove app/controller/
    fileName = fileName.substring(
      fileName.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // transfer file name to cammelCase  custom-module/custom-controller => customModule/customController
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // split by / for nested directories
    let fileNames = fileName.split(sep);

    // [custom-module, custom-controller] = > { customModule: { customController: require(filePath) } }
    let tempController = controller;
    for (let i = 0; i < fileNames.length; i++) {
      if (i == fileNames.length - 1) {
        const ControllerModule = require(path.resolve(file))(app); // class controller
        tempController[fileNames[i]] = new ControllerModule();
      } else {
        if (!tempController[fileNames[i]]) {
          tempController[fileNames[i]] = {};
        }
        tempController = tempController[fileNames[i]];
      }
    }
  });

  app.controller = controller;
};
