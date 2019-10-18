class WatchersController {
  /**
   * Get all watchers
   * @param {ctx} Koa Context
   */
  // eslint-disable-next-line class-methods-use-this
  async find(ctx) {
    ctx.body = [];
  }
}

module.exports = new WatchersController();
