const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function check() {
    const { data } = await supabase.from('patients').select('*').limit(1).single();
    if (data) {
        Object.keys(data).forEach(k => console.log('COL:', k));
    }
}
check();
