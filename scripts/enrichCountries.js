const { getCountriesDetails } = require('../src/getCountriesDetails');

(async () => {
    try {
        await getCountriesDetails()
        console.log('✅ Enriched JSON file created at: data/geonames_enriched_info.json');
    } catch (err) {
        console.error('❌ Error enriching countries data:', err.message);
    }
})();