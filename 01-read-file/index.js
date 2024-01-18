const { join } = require('path');
const fs = require('fs');
const { stdout } = require('process');
const filePath = join(__dirname, 'text.txt');
const readFile = fs.createReadStream(filePath, { encoding: 'utf8' });

readFile.on('data', (data) => {
  stdout.write(data);
});
