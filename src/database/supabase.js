/**
 * EventEase Supabase Database Client
 * 
 * This file creates and exports a Supabase client instance for database operations.
 */

import { createClient } from '@supabase/supabase-js';
require('dotenv').config();

// Supabase connection details (should be in .env file)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Initialize Supabase connection and perform any startup checks
 * @returns {Object} Supabase client
 */
export const initSupabase = async () => {
  try {
    // Test connection by fetching server timestamp
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log('Supabase connection established successfully');
    return supabase;
  } catch (error) {
    console.error(`Error connecting to Supabase: ${error.message}`);
    throw error;
  }
};

// Export the Supabase client
export default supabase;
