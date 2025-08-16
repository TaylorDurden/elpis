const Koa = require('koa');
const path = require('path');
// compatibility for different OS path '/'
const { sep } = path;

module.exports = {
  start(options = {}) {
    const app = new Koa();

    // apply options config
    app.options = options;
    // console.log(app.options);

    // base dir
    app.baseDir = process.cwd();
    // console.log(app.baseDir);

    // business path
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
    // console.log(app.businessPath);

    try {
      const port = process.env.PORT || 8080;
      const host = process.env.IP || '0.0.0.0';
      app.listen(port, host);
      console.log(`Server running on port: ${port}`);
    } catch (error) {
      console.error(error);
    }
  },
};
