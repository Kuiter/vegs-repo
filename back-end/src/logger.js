function logger() {
  return {
    debug: function (msg) {
      console.log('-DEBUG-', msg);
    }
  };
}

module.exports = logger;