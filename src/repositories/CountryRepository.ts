import { Country } from "../../types/Country";

export class CountryRepository {
    /**
     * Creates an instance of the CountryRepository.
     * @param countries - An array of Country objects to operate on.
     */
    constructor(private countries: Country[]) {}

    /**
     * Retrieves all available countries.
     * @returns An array of all countries.
     */
    getCountries(): Country[] {
        return this.countries;
    }

    /**
     * Retrieves a single country by ISO Alpha-2 or ISO Alpha-3 code.
     * @param nameOrIso - The ISO Alpha-2 or ISO Alpha-3 code of the country.
     * @returns The matched Country object, or undefined if not found.
     */
    getCountry(nameOrIso: string): Country | undefined {
        return this.countries.find(c => c.isoAlpha2 === nameOrIso || c.isoAlpha3 === nameOrIso);
    }

    /**
     * Retrieves all countries that are members of the European Union.
     * @returns An array of countries in the EU.
     */
    getEUCountries(): Country[] {
        return this.countries.filter(c => c.isInEU);
    }

    /**
     * Retrieves all countries that are part of the Schengen Area.
     * @returns An array of Schengen member countries.
     */
    getSchengenCountries(): Country[] {
        return this.countries.filter(c => c.isInSchengen);
    }

    /**
     * Retrieves all countries that use a specific currency.
     * @param currency - The full currency string (e.g. "Euro (EUR)").
     * @returns An array of countries using the given currency.
     */
    getCountriesByCurrency(currency: string): Country[] {
        return this.countries.filter(c => c.currency === currency);
    }

    /**
     * Retrieves all countries where the specified language is mentioned.
     * @param language - The name of the language (case-insensitive substring match).
     * @returns An array of countries where the language is spoken.
     */
    getCountriesByLanguage(language: string): Country[] {
        return this.countries.filter(c => c.languages.toLowerCase().includes(language.toLowerCase()));
    }

    /**
     * Retrieves all countries located in a specific continent.
     * @param continent - The continent code (e.g. "EU", "AS", "AF").
     * @returns An array of countries in the given continent.
     */
    getCountriesByContinent(continent: string): Country[] {
        return this.countries.filter(c => c.continent === continent);
    }
}
