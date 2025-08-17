import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkrbomyquyjilzvndtsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcmJvbXlxdXlqaWx6dm5kdHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NjI0NDUsImV4cCI6MjA3MTAzODQ0NX0.UnN0Mmqz-Zrc_kIVovsYoX7d3pmuRER4jXH9rLXzriE';
export const supabase = createClient(supabaseUrl, supabaseKey);
