const { join, parse } = require('path');
const fs = require('fs');
const { appendFile } = fs;
const { readdir, rm, copyFile, mkdir, writeFile, readFile } = fs.promises;
const rootPath = join(__dirname, 'styles');
const rootAssets = join(__dirname, 'assets');
const distPath = join(__dirname, 'project-dist');
const distAssets = join(distPath, 'assets');
const resultCssPath = join(__dirname, 'project-dist', 'style.css');
const rootTemplate = join(__dirname, 'template.html');
const resultTemplate = join(distPath, 'index.html');
const rootComponents = join(__dirname, 'components');

async function deleteFolder() {
  return rm(distPath, { force: true, recursive: true });
}

async function createFolder(path) {
  return mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function createStyle() {
  const files = await readdir(rootPath, { withFileTypes: true });

  files.forEach((file) => {
    const filePath = join(rootPath, file.name);
    const details = parse(filePath);

    if (file.isFile() && details.ext === '.css') {
      readFile(filePath, { encoding: 'utf8' }).then((data) => {
        appendFile(resultCssPath, data + '\n', (error) => {
          if (error) throw error;
        });
      });
    }
  });
}

async function copyAssets(src, dist) {
  const files = await readdir(src, { withFileTypes: true });

  files.forEach(async (file) => {
    if (!file.isFile()) {
      await createFolder(join(distAssets, file.name));
      copyAssets(join(rootAssets, file.name), file.name);
    } else {
      copyFile(join(src, file.name), join(distAssets, dist, file.name));
    }
  });
}

async function createHtml() {
  const files = await readdir(rootComponents, { withFileTypes: true });
  let html = '';
  let count = 0;

  await readFile(rootTemplate, { encoding: 'utf8' }).then((data) => {
    html += data;
  });

  files.forEach(async (file) => {
    const filePath = join(rootComponents, file.name);
    const details = parse(filePath);

    if (details.ext === '.html' && file.isFile()) {
      await readFile(filePath, { encoding: 'utf8' }).then((data) => {
        const tag = `{{${details.name}}}`;
        html = html.replace(tag, data);
        count += 1;

        if (files.length === count) {
          writeFile(resultTemplate, html);
        }
      });
    }
  });
}

(async function createBundle() {
  await deleteFolder();
  await createFolder(distPath);
  createStyle();
  copyAssets(rootAssets);
  createHtml();
})();
