import { formatSwtf } from './index';

if (process.argv[0] == 'swtf-fmt' && process.argv.length < 2) {
    console.log('Usage: swtf-fmt <input_file_name>');
    exit(1);
}

if (process.argv[0].endsWith('node') && process.argv.length < 3) {
    console.log('Usage: node ./bin/app.js <input_file_name>');
    exit(1);
}


import fs from 'fs';
import { exit } from 'process';
const inputFilePath = process.argv[0] == 'swtf-fmt' ? process.argv[1] : process.argv[2];

if (!fs.existsSync(inputFilePath)) {
    console.log(`Input file: ${inputFilePath} doesn't exist`);
    exit(1);
}

process.stdout.write(formatSwtf(fs.readFileSync(inputFilePath).toString()));