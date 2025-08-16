const path = require('path');
const { sep } = require('path');

/**
 * config loader
 * @param {object} app koa instance
 *
 * differ config local/beta/prod by env from env.config
 * env.config cover default.config and load to app.config
 *
 * yourproject/config/
 *
 * config dir configuration
 * default config: config/config.default.js
 * local config: config/config.local.js
 * beta config: config/config.beta.js
 * prod config: config/config.prod.js
 *
 */

module.exports = (app) => {
  // get config dir
  const configPath = path.resolve(app.baseDir, `${sep}config`);

  // get default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(
      configPath,
      `${sep}config.default.js`
    ));
  } catch (error) {
    console.log(`[exception] config.default.js not found`);
  }

  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, `${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, `${sep}config.beta.js`));
    } else if (app.env.isProd()) {
      envConfig = require(path.resolve(configPath, `${sep}config.prod.js`));
    }
  } catch (error) {
    console.log(`[exception] config.${app.env}.js not found`);
  }
  // assign default.config & env.config to app.config
  app.config = Object.assign({}, defaultConfig, envConfig);
};
