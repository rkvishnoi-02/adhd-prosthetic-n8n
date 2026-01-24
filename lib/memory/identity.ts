import { supabase } from '@/lib/supabase/client';
import { UserIdentity } from '@/types';

/**
 * Get user identity memory
 */
export async function getIdentity(userId: string): Promise<UserIdentity | null> {
  const { data, error } = await supabase
    .from('user_memory')
    .select('name, role, current_project, why_it_matters')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    name: data.name || '',
    role: data.role || '',
    currentProject: data.current_project || '',
    whyItMatters: data.why_it_matters || '',
  };
}

/**
 * Set user identity memory
 */
export async function setIdentity(
  userId: string,
  identity: UserIdentity
): Promise<void> {
  const { error } = await supabase
    .from('user_memory')
    .upsert({
      user_id: userId,
      name: identity.name,
      role: identity.role,
      current_project: identity.currentProject,
      why_it_matters: identity.whyItMatters,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(`Failed to save identity: ${error.message}`);
  }
}

/**
 * Update partial identity fields
 */
export async function updateIdentity(
  userId: string,
  partialIdentity: Partial<UserIdentity>
): Promise<void> {
  const current = await getIdentity(userId);

  if (!current) {
    throw new Error('No identity found to update');
  }

  await setIdentity(userId, {
    ...current,
    ...partialIdentity,
  });
}
