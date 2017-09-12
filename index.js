const INPUT_CSV = 'input/test.csv';
const OUTPUT_CSV = 'output/test.csv';
const ADDRESS_COLUMN = 'adresse';
const SEPARATOR = ';';

const fs = require('fs');
const path = require('path');
const dsv = require('d3-dsv');
const axios = require('axios');

const inputPath = path.resolve(__dirname, INPUT_CSV);
const outputPath = path.resolve(__dirname, OUTPUT_CSV);

const csvParser = dsv.dsvFormat(SEPARATOR);

const data = csvParser.parse(fs.readFileSync(inputPath).toString());

async function geocodeRow(row) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      row.test = Math.random();
      console.log(row);
      resolve(row);
    }, 100);
  });
}

(async () => {
  for (let row of data) {
    row = await geocodeRow(row);
  }
  
  const output = csvParser.format(data);

  fs.writeFile(outputPath, output, err => {
    if (err) {
      throw err;
    }

    console.log('done.');
  });
})();
