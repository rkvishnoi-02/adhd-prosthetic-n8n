/**
 * API Route: Identity Memory (as @backend-api)
 * GET: Fetch user identity
 * POST: Update user identity
 *
 * Applies Supabase best practices:
 * - Proper RLS enforcement
 * - Efficient queries with indexes
 * - Error handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { getIdentity, setIdentity } from '@/lib/memory/identity';

/**
 * GET /api/memory/identity
 * Fetch user's identity memory
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user (Supabase best practice: security-rls-basics)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch identity using repository (Clean Architecture)
    const identity = await getIdentity(user.id);

    if (!identity) {
      return NextResponse.json(
        {
          identity: null,
          message: 'No identity found. User needs to complete onboarding.'
        },
        { status: 200 }
      );
    }

    // 3. Return identity
    return NextResponse.json({ identity });
  } catch (error) {
    console.error('Identity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/memory/identity
 * Update user's identity memory
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { name, role, currentProject, whyItMatters } = body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // 3. Save identity using repository
    await setIdentity(user.id, {
      name: name.trim(),
      role: role?.trim() || '',
      currentProject: currentProject?.trim() || '',
      whyItMatters: whyItMatters?.trim() || '',
    });

    // 4. Return updated identity
    const identity = await getIdentity(user.id);

    return NextResponse.json({
      identity,
      message: 'Identity updated successfully'
    });
  } catch (error) {
    console.error('Identity update error:', error);
    return NextResponse.json(
      { error: 'Failed to update identity' },
      { status: 500 }
    );
  }
}
