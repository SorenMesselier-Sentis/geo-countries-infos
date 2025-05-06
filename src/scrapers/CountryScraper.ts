import axios from "axios";
import * as cheerio from "cheerio";
import { Country } from "../types/Country";
import * as fs from "fs";

const EU_COUNTRIES: string[] = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
    "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
    "Spain", "Sweden"
];

const SCHENGEN_COUNTRIES: string[] = [
    "Austria", "Belgium", "Czech Republic", "Denmark", "Estonia", "Finland",
    "France", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia",
    "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Netherlands",
    "Norway", "Poland", "Portugal", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland"
];

export class CountryScraper {
    private baseUrl = "https://www.geonames.org";

    async fetchCountries(): Promise<Country[]> {
        const countries: Country[] = [];
        const res = await axios.get(`${this.baseUrl}/countries/`);
        const $ = cheerio.load(res.data);

        const rows = $("table.restable > tbody > tr");

        for (const el of rows.toArray()) {
            const cells = $(el).find("td");

            const isoAlpha2 = cells.eq(0).text().trim();
            const isoAlpha3 = cells.eq(1).text().trim();
            const isoNumeric = cells.eq(2).text().trim();
            const fipsCode = cells.eq(3).text().trim();
            const detailPath = cells.eq(4).find("a").attr("href") || "";
            const name = cells.eq(4).text().trim();
            const capital = cells.eq(5).text().trim();
            const continentCode = cells.eq(8).text().trim();

            const detailData = await this.fetchCountryDetail(detailPath);

            const isInEU = EU_COUNTRIES.includes(name);
            const isInSchengen = SCHENGEN_COUNTRIES.includes(name);

            countries.push({
                isoAlpha2,
                isoAlpha3,
                isoNumeric,
                fipsCode,
                name,
                capital,
                continentCode,
                detailPath,
                currency: detailData.currency,
                languages: detailData.languages,
                neighbours: detailData.neighbours,
                postalCodeFormat: detailData.postalCodeFormat,
                detailUrl: `${this.baseUrl}${detailPath}`,
                isInEU,
                isInSchengen
            });
        }

        await this.saveToJson(countries);

        return countries;
    }

    private async fetchCountryDetail(detailPath: string): Promise<{
        currency: string;
        languages: string;
        neighbours: string[];
        postalCodeFormat: string;
    }> {
        const res = await axios.get(`${this.baseUrl}${detailPath}`);
        const $ = cheerio.load(res.data);

        const getValueByLabel = (label: string): string => {
            const row = $(`table tr td:contains("${label}")`).first().next();
            return row ? row.text().trim() : "";
        };

        const currency = getValueByLabel("currency");
        const languages = getValueByLabel("languages");
        const postalCodeFormat = getValueByLabel("postal code format");

        const neighbours = $(`table tr td:contains("neighbours")`).first().next().find("a")
            .toArray().map(a => $(a).text().trim());

        return {
            currency,
            languages,
            neighbours,
            postalCodeFormat
        };
    }

    private async saveToJson(countries: Country[]): Promise<void> {
        const filePath = "countries.json";
        const jsonData = JSON.stringify(countries, null, 2);
        fs.writeFileSync(filePath, jsonData);
        console.log(`Countries data saved to ${filePath}`);
    }
}

const scraper = new CountryScraper();
scraper.fetchCountries().then((countries: Country[]) => {
    console.log(`${countries.length} countries scraped successfully.`);
}).catch(error => {
    console.error("Error scraping countries: ", error);
});
