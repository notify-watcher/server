class WatchersController {
  /**
   * Get all watchers
   * @param {ctx} Koa Context
   */
  async find(ctx) {
    ctx.body = [];
  }
}

module.exports = new WatchersController();
