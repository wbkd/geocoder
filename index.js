const INPUT_CSV = 'input/test.csv'; // location of the input csv file
const OUTPUT_CSV = 'output/test.csv'; // location where to store the result
const ADDRESS_COLUMN = 'adresse'; // the name of the field in the csv that stores the address string
const DELIMITER = ';'; // the csv file delimiter
const GOOGLE_API_KEY = 'YOUR_API_KEY'; // your google geocoder api key: https://developers.google.com/maps/documentation/geocoding/start?hl=de#get-a-key
const ADD_CLEAN_ADRESS_ROW = false;

const fs = require('fs');
const path = require('path');
const dsv = require('d3-dsv');
const axios = require('axios');
const idx = require('idx');

const inputPath = path.resolve(__dirname, INPUT_CSV);
const outputPath = path.resolve(__dirname, OUTPUT_CSV);

const csvParser = dsv.dsvFormat(DELIMITER);

const data = csvParser.parse(fs.readFileSync(inputPath).toString());

async function geocodeRow(row) {
  return new Promise((resolve, reject) => {
    const address = row[ADDRESS_COLUMN];
    row.lat = '';
    row.lng = '';

    if (ADD_CLEAN_ADRESS_ROW) {
      row.address_clean = '';
    }

    if (!address) {
      return resolve(row);
    }

    console.log('geocoding address:', address);

    const cleanedAddress = address
      .replace(/\s/g, '+')
      .replace(/ß/g, 'ss')
      .replace(/ö|Ö/g, 'oe')
      .replace(/ü|Ü/g, 'ue')
      .replace(/ä|Ä/g, 'ae');

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cleanedAddress}&key=${GOOGLE_API_KEY}`)
      .then(res => {
        row.lat = idx(res.data, _ => _.results[0].geometry.location.lat) || '';
        row.lng = idx(res.data, _ => _.results[0].geometry.location.lng) || '';

        if (ADD_CLEAN_ADRESS_ROW) {
          row.address_clean = idx(res.data, _ => _.results[0].formatted_address) || '';
        }

        resolve(row);
      })
      .catch(err => {
        resolve(row);
      })
  });
}

(async () => {
  let successCounter = 0;

  for (let row of data) {
    row = await geocodeRow(row);
    if (row.lat && row.lng) {
      successCounter++;
    }
  }

  const output = csvParser.format(data);

  fs.writeFile(outputPath, output, err => {
    if (err) {
      throw err;
    }

    console.log(`${successCounter} of ${data.length} rows geocoded and written to: ${OUTPUT_CSV}`);
  });
})();
