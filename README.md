Absolutely! Here's a complete and professional `README.md` for your **`geo-countries-infos`** project that explains what it does, how to install it, how to use both the scraper and the repository, and includes examples.

---

# 🌍 geo-countries-infos

A TypeScript utility for scraping and querying detailed information about countries, including ISO codes, capitals, currencies, languages, EU/Schengen membership, and more.

- 🔎 Scrapes data from [geonames.org](https://www.geonames.org/)
- 🌐 Supports filtering by continent, currency, language, EU & Schengen
- 💾 Saves country data as `countries.json`
- 💡 Provides an easy-to-use `CountryRepository` class

---

## Installation

```bash
npm install geo-countries-infos
```

---

## Scraping Country Data

The package includes a scraper that fetches country data from `geonames.org` and writes it to a local `countries.json` file.

### Example

```ts
import { CountryScraper } from 'geo-countries-infos';

const scraper = new CountryScraper();

scraper.fetchCountries().then(countries => {
  console.log(`${countries.length} countries scraped successfully.`);
}).catch(console.error);
```

This generates a file `countries.json` in the root directory containing an array of country objects.

---

## Using CountryRepository

After generating or loading the country data, you can use the `CountryRepository` to easily query it.

### Example

```ts
import { readFileSync } from "fs";
import { CountryRepository } from 'geo-countries-infos';
import { Country } from 'geo-countries-infos/types/Country';

const rawData = readFileSync("countries.json", "utf-8");
const countries: Country[] = JSON.parse(rawData);
const repo = new CountryRepository(countries);

console.log(repo.getCountry("DE")); // Germany
console.log(repo.getEUCountries().map(c => c.name));
console.log(repo.getCountriesByCurrency("Euro (EUR)"));
```

---

## API

### CountryRepository

```ts
new CountryRepository(countries: Country[])
```

#### Methods

* `getCountries(): Country[]` — All countries
* `getCountry(code: string): Country | undefined` — By ISO Alpha-2 or Alpha-3
* `getEUCountries(): Country[]`
* `getSchengenCountries(): Country[]`
* `getCountriesByCurrency(currency: string): Country[]`
* `getCountriesByLanguage(language: string): Country[]`
* `getCountriesByContinent(continent: string): Country[]` — E.g., `"EU"`, `"AS"`, `"AF"`

---

## Testing Locally

To test your local scrape and query logic:

```ts
// testRepository.ts
import { readFileSync } from "fs";
import { CountryRepository } from './src/repositories/CountryRepository'; // adjust path as needed

const data = JSON.parse(readFileSync("countries.json", "utf-8"));
const repo = new CountryRepository(data);

console.log("EU countries:", repo.getEUCountries().length);
```

Run with:

```bash
npx ts-node testRepository.ts
```

---

## License

MIT

---

## 🙌 Acknowledgements

* Data sourced from [geonames.org](https://www.geonames.org/)