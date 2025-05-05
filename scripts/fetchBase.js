const { fetchBaseCountries } = require('../src/fetchBaseCountries');

(async () => {
    try {
        await fetchBaseCountries();
        console.log('✅ Base JSON file created at: data/geonames_base_info.json');
    } catch (err) {
        console.error('❌ Error creating base JSON file:', err.message);
    }
})();