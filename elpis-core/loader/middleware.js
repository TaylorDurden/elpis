const path = require('path');
// compatibility for different OS path '/'
const { sep } = path;
const glob = require('glob');
/**
 * middleware loader
 * @param {*} app Koa instance
 *
 * This module is responsible for loading all middlewares into the Koa application.
 * For example,
 * app/
 *   middleware/
 *      auth/
 *        jwt-auth.js
 *      utils/
 *        request-validator.js
 *
 * Output:
 * app.middlewares = {
 *   auth: {
 *     jwtAuth: require('./app/middleware/auth/jwt-auth.js')(app)
 *   },
 *   utils: {
 *     requestValidator: require('./app/middleware/utils/request-validator.js')(app)
 *   }
 * };
 */
module.exports = (app) => {
  // read all files app/middleware/**/**.js
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`)
  );

  const middlewares = {};

  fileList.forEach((file) => {
    // 提取文件名称
    let fileName = path.resolve(file);

    // substring path app/middleware/custom-module/custom-middleware.js => custom-module/custom-middleware
    // remove app/middleware/
    fileName = fileName.substring(
      fileName.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // transfer file name to cammelCase: custom-module/custom-middleware => customModule/customMiddleware
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // split by / for nested directories
    let fileNames = fileName.split(sep);

    // [custom-module, custom-middleware] = > { customModule: { customMiddleware: require(文件地址) } }
    let tempMiddleware = middlewares;
    for (let i = 0; i < fileNames.length; i++) {
      if (i == fileNames.length - 1) {
        tempMiddleware[fileNames[i]] = require(path.resolve(file))(app); // 每个文件都传入 app 实例
      } else {
        if (!tempMiddleware[fileNames[i]]) {
          tempMiddleware[fileNames[i]] = {};
        }
        tempMiddleware = tempMiddleware[fileNames[i]];
      }
    }
  });

  app.middlewares = middlewares;
};
