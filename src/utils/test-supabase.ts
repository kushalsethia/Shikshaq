// Utility to test Supabase connection
import { supabase } from '@/integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

  // Test 1: Simple count query
  try {
    const { count, error } = await supabase
      .from('teachers_list')
      .select('*', { count: 'exact', head: true });
    
    console.log('Test 1 - Count teachers:', { count, error });
  } catch (e) {
    console.error('Test 1 failed:', e);
  }

  // Test 2: Get all teachers
  try {
    const { data, error } = await supabase
      .from('teachers_list')
      .select('*')
      .limit(5);
    
    console.log('Test 2 - Get teachers:', { 
      count: data?.length || 0, 
      error,
      sample: data?.[0] 
    });
  } catch (e) {
    console.error('Test 2 failed:', e);
  }

  // Test 3: Get subjects
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .limit(5);
    
    console.log('Test 3 - Get subjects:', { 
      count: data?.length || 0, 
      error,
      sample: data?.[0] 
    });
  } catch (e) {
    console.error('Test 3 failed:', e);
  }

  // Test 4: Check RLS policies
  try {
    const { data, error } = await supabase
      .from('teachers_list')
      .select('id, name')
      .limit(1);
    
    if (error) {
      console.error('Test 4 - RLS Check failed:', error);
      console.error('This might be an RLS policy issue. Check your Supabase policies.');
    } else {
      console.log('Test 4 - RLS Check passed:', data);
    }
  } catch (e) {
    console.error('Test 4 failed:', e);
  }
}

