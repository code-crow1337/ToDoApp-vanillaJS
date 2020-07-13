module.exports = {
  entry: {
    todo: './src/js/todo.js',
  },
  devServer: {
    stats: {
      children: false,
    },
    contentBase: './src',
  },
};
