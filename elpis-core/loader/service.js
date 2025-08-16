const path = require('path');
const { sep } = require('path');
const glob = require('glob'); // 读取目录下的所有文件
/**
 * service loader
 * @param {object} app Koa instance
 *
 * load all service, load to Koa instance
 * access 'app.service.${directory}.${file}'
 * app/service
 *    |
 *    |-- custom-module
 *            |
 *            |-- custom-service.js
 *
 * => app.service.customModule.customService access to file
 *      ↓
 * app.service = {
 *          customModule: {
 *              customService: require(filePath)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // read app/service/**/**.js directory all files
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));

  const service = {};

  fileList.forEach((file) => {
    // get file name
    let fileName = path.resolve(file);

    // substring app/service/custom-module/custom-service.js => custom-module/custom-service
    // remove app/service/
    fileName = fileName.substring(
      fileName.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // transfer file name to cammelCase: custom-module/custom-service => customModule/customService
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    let fileNames = fileName.split(sep);

    // [custom-module, custom-service] = > { customModule: { customService: require(文件地址) } }
    let temService = service;
    for (let i = 0; i < fileNames.length; i++) {
      if (i == fileNames.length - 1) {
        // final file
        const ControllerModule = require(path.resolve(file))(app); // class service
        temService[fileNames[i]] = new ControllerModule(); // initiate
      } else {
        // dir
        if (!temService[fileNames[i]]) {
          temService[fileNames[i]] = {};
        }
        temService = temService[fileNames[i]];
      }
    }
  });

  app.service = service;
};
