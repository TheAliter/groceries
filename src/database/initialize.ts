import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kjmeloeasulnyoiifnse.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbWVsb2Vhc3VsbnlvaWlmbnNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk5OTQ3MzIsImV4cCI6MTk4NTU3MDczMn0.wQQyka0MLkHXjWosdg0Qi-IQuY-BEHfywWTTpTMNzRQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
