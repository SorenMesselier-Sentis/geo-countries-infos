const fs = require("fs/promises");
const path = require("path");

async function getCountry(nameOrIso) {
    let countries;

    try {
        const file = await fs.readFile(path.join("data", "geonames_enriched_info.json"), "utf-8");
        countries = JSON.parse(file);
    } catch (err) {
        throw new Error("Error reading the enriched country data file.");
    }

    if (!nameOrIso) throw new Error("No country or ISO code provided");

    const searchKey = nameOrIso.toLowerCase();
    const country = countries.find(
        (c) =>
            c.countryName.toLowerCase() === searchKey ||
            c.isoAlpha2.toLowerCase() === searchKey ||
            c.isoAlpha3.toLowerCase() === searchKey
    );

    if (!country) throw new Error(`Country not found: ${nameOrIso}`);

    return country;
}

module.exports = { getCountry };
