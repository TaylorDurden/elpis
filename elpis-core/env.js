module.exports = (app) => {
  return {
    isLocal() {
      return (
        process.env.NODE_ENV === 'local' ||
        process.env.NODE_ENV === 'development'
      );
    },
    isBeta() {
      return process.env.NODE_ENV === 'beta';
    },
    isProd() {
      return process.env.NODE_ENV === 'production';
    },

    // get current environment
    get() {
      return process.env.NODE_ENV ?? 'local';
    },
  };
};
