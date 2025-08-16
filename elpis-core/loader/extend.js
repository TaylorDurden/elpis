const path = require('path');
const { sep } = require('path');
const glob = require('glob');
/**
 * extend loader
 * @param {object} app Koa instance
 *
 *
 * access 'app.extend.${dir}.${file}'
 * app/extend
 *     |
 *     |-- custom-extend.js
 *
 * => app.extend.customModule.customExtend access to file
 *      ↓
 * app.extend = {
 *          customModule: {
 *              customExtend: require(filePath)
 *            }
 *      }
 *
 */
module.exports = (app) => {
  // read app/extend/**.js directory all files
  const extendPath = path.resolve(app.businessPath, `${sep}extend`);
  const fileList = glob.sync(path.resolve(extendPath, `${sep}**${sep}**.js`));

  fileList.forEach((file) => {
    // get file name
    let fileName = path.resolve(file);

    // substring app/extend/custom-extend.js => custom-extend
    // remove app/extend/
    fileName = fileName.substring(
      fileName.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      fileName.lastIndexOf(`.js`)
    );

    // transfer file name to cammelCase: custom-extend => customExtend
    fileName = fileName.replace(/[_-][a-z]/gi, (s) =>
      s.substring(1).toUpperCase()
    );

    // filter out existing key in app
    if (Object.prototype.hasOwnProperty.call(app, fileName)) {
      console.log(`[extend load error] ${fileName} is already exists in app`);
      return;
    }
    // assign extend to app.extend
    app[fileName] = require(path.resolve(file))(app);
  });
};
