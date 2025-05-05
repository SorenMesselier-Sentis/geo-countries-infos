const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs/promises");
require("dotenv").config();

async function fetchBaseCountries() {
    const url = `${process.env.BASE_URL}/countries/`;
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    const countries = [];

    $('table.restable tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length < 9) return;

        const countryNameCell = $(cells[4]).find('a');
        countries.push({
            isoAlpha2: $(cells[0]).text().trim(),
            isoAlpha3: $(cells[1]).text().trim(),
            isoNumeric: $(cells[2]).text().trim(),
            fipsCode: $(cells[3]).text().trim(),
            countryName: countryNameCell.text().trim(),
            capital: $(cells[5]).text().trim(),
            continentCode: $(cells[8]).text().trim(),
            detailPath: countryNameCell.attr('href'),
        });
    });

    await fs.mkdir('data', {recursive: true});
    await fs.writeFile('data/geonames_base_info.json', JSON.stringify(countries, null, 2));

    return countries;
}

module.exports = {fetchBaseCountries};
