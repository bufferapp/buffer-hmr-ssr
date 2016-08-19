
// Compile files on the fly see https://babeljs.io/docs/usage/require/
require('babel-register')({
  // Optional only regex - if any filenames **don't** match this regex then they
  // aren't compiled
  only(filename) {
    // If any files are in the build or node_modules directories **don't** compile them
    return (filename.indexOf('build') === -1 && filename.indexOf('node_modules') === -1);
  },
  extensions: ['.js']
});
require('babel-polyfill');

// Initialize Server
require('./server');
