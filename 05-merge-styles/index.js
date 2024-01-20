const { join, extname } = require('path');
const fs = require('fs');
const { appendFile, readFile } = fs;
const { readdir, rm } = fs.promises;
const rootPath = join(__dirname, 'styles');
const resultPath = join(__dirname, 'project-dist', 'bundle.css');

async function createBundle() {
  const files = await readdir(rootPath, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = join(rootPath, file.name);

    if (extname(filePath) === '.css' && file.isFile()) {
      readFile(filePath, { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        appendFile(resultPath, data + '\n', (error) => {
          if (error) throw error;
        });
      });
    }
  });
}

rm(resultPath, { force: true, recursive: true }).then(() => createBundle());
