
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
    
    console.log('🔧 Promoting user to admin:', user.email, user.id);
    
    // First check if profile exists, if not create it
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (!existingProfile) {
      // Create profile if it doesn't exist
      console.log('📝 Creating profile for user:', user.id);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          role: 'admin',
          wallet_address: '0x' + user.id.replace(/-/g, '').substring(0, 40),
          kyc_status: 'approved',
          wallet_approved: true
        });
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return { success: false, error: createError.message };
      }
    } else {
      // Update existing profile
      console.log('🔄 Updating existing profile to admin');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        return { success: false, error: updateError.message };
      }
    }
    
    console.log('✅ Successfully promoted current user to admin');
    return { success: true };
    
  } catch (error) {
    console.error('Error promoting user:', error);
    return { success: false, error: 'Failed to promote user' };
  }
};
