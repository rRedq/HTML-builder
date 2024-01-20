const { join } = require('path');
const fs = require('fs');
const { mkdir, copyFile } = fs;
const { readdir, rm } = fs.promises;
const filePath = join(__dirname, 'files');
const newFilePath = join(__dirname, 'files-copy');

async function copyDirectory() {
  const files = await readdir(filePath, { withFileTypes: true });

  mkdir(newFilePath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  files.forEach((file) => {
    copyFile(join(filePath, file.name), join(newFilePath, file.name), (err) => {
      if (err) throw err;
    });
  });
}

rm(newFilePath, { force: true, recursive: true }).then(() => copyDirectory());
