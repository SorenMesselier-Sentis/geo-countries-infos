import {readFileSync} from "fs";
import {Country} from "../types/Country";
import {CountryRepository} from "../repositories/CountryRepository";

const rawData = readFileSync("./src/data/countries.json", "utf-8");
const countries: Country[] = JSON.parse(rawData);

const repo = new CountryRepository(countries);

console.log("Total countries:", repo.getCountries().length);
console.log("Germany by ISO Alpha-2 (DE):", repo.getCountry("DE"));
console.log("Countries using Euro (EUR):", repo.getCountriesByCurrency("Euro (EUR)").map(c => c.name));
console.log("EU countries count:", repo.getEUCountries().length);
console.log("Schengen countries count:", repo.getSchengenCountries().length);
console.log("Countries in Europe (EU continent code):", repo.getCountriesByContinent("EU").map(c => c.name));
console.log("Countries speaking French:", repo.getCountriesByLanguage("french").map(c => c.name));