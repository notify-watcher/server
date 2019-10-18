module.exports = ({ baseRouter }) => {
  baseRouter.get('/', ctx => {
    ctx.body = 'Hello World!';
  });
};
