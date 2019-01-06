/**
 * Node API gateway staring point
*/

require('@babel/register')({
  presets: ['@babel/env'],
});
require('@babel/polyfill');

require('./gateway');
