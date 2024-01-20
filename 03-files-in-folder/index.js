const { join, parse } = require('path');
const fs = require('fs');
const { readdir, stat } = fs.promises;
const rootPath = join(__dirname, 'secret-folder');

(async function getFileInformation() {
  const files = await readdir(rootPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      return false;
    }
    const filePath = join(rootPath, file.name);
    const details = parse(filePath);

    stat(filePath).then((data) => {
      console.log(
        `${details.name} - ${details.ext.split('.')[1]} - ${
          (data.size / 1024).toFixed(2) + 'kb'
        }`,
      );
    });
  });
})();
