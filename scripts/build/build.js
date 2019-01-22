const fs = require('fs-extra');
const glob = require('glob-promise');
const babel = require('@babel/core');
const path = require('path');

async function build(srcDir, buildDir, allowedExtensions) {
  // Remove the existing SDK src directory
  await fs.remove(buildDir);

  // Create the SDK src directory
  await fs.ensureDir(buildDir);

  // Gather all the src files
  const files = await glob(path.resolve(srcDir, '**/*.js'));

  const promises = allowedExtensions.map((allowedExtension) => {
    const filteredFiles = files.filter((file) => {
      // Filter any file that contains an extension that matches the
      // allowed extension
      if (file.indexOf(allowedExtension) > 0) {
        return true;
      }

      // The remaining files may contain multiple extensions for other platforms.
      // An example could be *.foo.js which do not belong in this build.
      // We will filter any file that contains only the .js extension
      if ((file.match(/\./g) || []).length === 1 && file.indexOf('.js') > 0) {
        return true;
      }

      return false;
    });

    // Transform each file with babel
    return filteredFiles.map((file) => {
      babel.transformFileAsync(file)
        .then(({ code }) => fs.outputFile(path.join(buildDir, file.replace(srcDir, '').replace(allowedExtension, '')), code));
    });
  });

  return Promise.all(promises);
}

module.exports = build;