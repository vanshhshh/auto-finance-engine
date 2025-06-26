
import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async (userEmail: string) => {
  try {
    console.log('🔧 Setting up admin user for:', userEmail);
    
    // First, get the user by email from auth.users
    const { data, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return { success: false, error: listError.message };
    }
    
    const user = data.users?.find((u: any) => u.email === userEmail);
    
    if (!user) {
      console.error('User not found:', userEmail);
      return { success: false, error: 'User not found' };
    }
    
    // Update the user's profile to make them admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('user_id', user.id);
    
    if (updateError) {
      console.error('Error updating user role:', updateError);
      return { success: false, error: updateError.message };
    }
    
    console.log('✅ Successfully made user admin:', userEmail);
    return { success: true };
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error: 'Failed to create admin user' };
  }
};

// Function to manually promote current user to admin (for development)
export const promoteCurrentUserToAdmin = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error promoting user to admin:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Successfully promoted current user to admin');
    return { success: true };
    
  } catch (error) {
    console.error('Error promoting user:', error);
    return { success: false, error: 'Failed to promote user' };
  }
};
