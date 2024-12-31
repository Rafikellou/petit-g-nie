const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://rgddalgzstcoysrcdetw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZGRhbGd6c3Rjb3lzcmNkZXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjYyMTMxNCwiZXhwIjoyMDQ4MTk3MzE0fQ.jVtIWPiNTrUrTUbmOG_v9BgQ6yQ-m4sPBsqJEtYIky0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
    try {
        const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '01_initial_schema.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        const { data, error } = await supabase.rpc('exec_sql', {
            query: sqlContent
        });

        if (error) {
            console.error('Error initializing database:', error);
            return;
        }

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

initializeDatabase();
