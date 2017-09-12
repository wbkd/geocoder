# Geocoder

### Installation

Clone the repository

```bash
git clone git@github.com:wbkd/geocoder.git && cd geocoder
```

Install dependencies

```bash
npm install # with node version 7 or higher
```

### Customization

To geocode your own csv file, you need to change these variables in `index.js`:

```javascript
const INPUT_CSV = 'input/test.csv'; // location of the input csv file
const OUTPUT_CSV = 'output/test.csv'; // location where to store the result
const ADDRESS_COLUMN = 'adresse'; // the name of the field in the csv that stores the address string
const DELIMITER = ';'; // the csv file delimiter
const GOOGLE_API_KEY = 'YOUR_API_KEY'; // your google geocoder api key: https://developers.google.com/maps/documentation/geocoding/start?hl=de#get-a-key
```

### Run the script!

```bash
npm start
```
