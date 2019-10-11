module.exports = ({ watchersRouter }) => {
  watchersRouter.get('/', (ctx, next) => {
    ctx.body = [];
  });
};
