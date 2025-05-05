const { getCountry } = require('../src/getCountry');

const countryCode = process.argv[2];

(async () => {
    try {
        if (!countryCode) {
            throw new Error("No country or ISO code provided");
        }

        const country = await getCountry(countryCode);
        console.log(country);
    } catch (err) {
        console.error('❌ Error fetching country:', err.message);
    }
})();
