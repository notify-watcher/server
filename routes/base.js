module.exports = ({ baseRouter }) => {
  baseRouter.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
  });
};
