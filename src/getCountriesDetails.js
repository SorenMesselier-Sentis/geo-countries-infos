const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs/promises");

async function getCountryDetails(country) {
    const baseUrl = process.env.BASE_URL || "https://www.geonames.org";

    if (!country.detailPath) {
        console.error(`❌ Missing detailPath for ${country.countryName}`);
        return null;
    }

    const detailUrl = baseUrl + country.detailPath;

    try {
        const {data} = await axios.get(detailUrl);
        const $ = cheerio.load(data);
        const table = $('table[cellpadding="5"]');

        const extractTextAfterLabel = (label) => {
            const row = table.find(`tr:has(td:contains("${label}"))`);
            return row.find("td").eq(1).text().trim();
        };

        const currency = extractTextAfterLabel("currency");
        const languages = extractTextAfterLabel("languages");

        const neighboursRow = table.find(`tr:has(td:contains("neighbours"))`);
        const neighbours = neighboursRow.find("td a").map((_, el) => $(el).text().trim()).get();

        const postalCodeFormat = extractTextAfterLabel("postal code format");

        const flagRow = table.find(`tr:has(td:contains("national flag"))`);
        const flagUrl = flagRow.find("img").attr("src") || null;

        const { getCountryMeta } = require("./utils");
        const meta = getCountryMeta(country.countryName);

        return {
            ...country,
            currency,
            languages,
            neighbours,
            postalCodeFormat,
            flagUrl,
            detailUrl,
            ...meta,
        };
    } catch (err) {
        console.error(`❌ Error processing ${country.countryName}: ${err.message}`);
        return null;
    }
}

async function enrichCountries() {
    const filePath = "data/geonames_base_info.json";

    try {
        const rawData = await fs.readFile(filePath, "utf-8");
        const countries = JSON.parse(rawData);
        const enrichedCountries = [];

        for (const country of countries) {
            const enrichedCountry = await getCountryDetails(country);

            if (enrichedCountry) {
                enrichedCountries.push(enrichedCountry);
                console.log(`✅ Processed: ${country.countryName}`);
            } else {
                console.log(`❌ Skipped: ${country.countryName}`);
            }
        }

        if (enrichedCountries.length > 0) {
            await fs.writeFile("data/geonames_enriched_info.json", JSON.stringify(enrichedCountries, null, 2));
            console.log("✅ Enriched data saved to: data/geonames_enriched_info.json");
        } else {
            console.log("❌ No countries were enriched.");
        }
    } catch (err) {
        console.error(`❌ Error reading the base data file: ${err.message}`);
    }
}

enrichCountries();
