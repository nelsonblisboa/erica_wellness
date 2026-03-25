const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function checkTables() {
    // If we use the REST API, calling the root /rest/v1/ returns OpenAPI spec.
    try {
        const url = process.env.SUPABASE_URL + '/rest/v1/?apikey=' + process.env.SUPABASE_KEY;
        console.log("Fetching swagger spec...");
        const res = await fetch(url);
        const json = await res.json();
        const tables = Object.keys(json.definitions || {}).filter(k => !k.includes('_'));
        console.log("Tables:", tables);
    } catch(err) {
        console.error(err);
    }
}
checkTables();
