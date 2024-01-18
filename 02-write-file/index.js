const { join } = require('path');
const fs = require('fs');
const { stdout, stdin } = require('process');
const filePath = join(__dirname, 'text.txt');
const readFile = fs.createWriteStream(filePath, { encoding: 'utf8' });

stdout.write('Please, enter whatever you want without hesitating: \n');
stdin.on('data', (data) => {
  if (data.toString().trim() !== 'exit') {
    readFile.write(data.toString());
  } else {
    process.exit();
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\n That"s all, goodbye'));
