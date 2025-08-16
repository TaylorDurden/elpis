const KoaRouter = require('koa-router');
const glob = require('glob');
const path = require('path');
const sep = path.sep;

/**
/**
 * router loader
 * @param {object} app Koa instance
 *
 * dir: app/router/**.js
 *
 * load app/router/**.js to KoaRouter
 *
 */
module.exports = (app) => {
  // router dir
  const routerPath = path.resolve(app.businessPath, `${sep}router`);
  // get router files
  const fileList = glob.sync(path.resolve(routerPath), `${sep}**${sep}**.js`);

  // instaniate koarouter
  const router = new KoaRouter();

  // register router
  fileList.forEach((file) => {
    /**
     * eg. file: app/router/api.js
     * modules.exports = (app,router)=>{
     *  router.get('/api',controller.api)
     * }
     */

    require(path.resolve(file))(app, router);
  });

  // fallback router
  router.all('*', async (ctx, next) => {
    ctx.status = 302; // temp redirction
    ctx.redirect(`${app?.options?.homePage ?? '/'}`);
  });

  // use router in app
  app.use(router.routes());
  app.use(router.allowedMethods()); // handle 405 & 501
};
