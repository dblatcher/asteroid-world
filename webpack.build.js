const path = require('path');
const merge = require('webpack-merge').merge;
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: "production",
  watch: false,
})

