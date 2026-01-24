/**
 * API Route: Session Management (as @backend-api)
 * POST: Update cognitive state
 * GET: Get current session
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import {
  getCurrentSession,
  updateCognitiveState,
  CognitiveState,
} from '@/lib/memory/session';

/**
 * GET /api/session
 * Get user's current active session
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current session
    const session = await getCurrentSession(user.id);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/session
 * Update cognitive state
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request
    const body = await request.json();
    const { cognitiveState } = body;

    // Validate
    const validStates: CognitiveState[] = [
      'focused',
      'overwhelmed',
      'stuck',
      'neutral',
      null,
    ];

    if (!validStates.includes(cognitiveState)) {
      return NextResponse.json(
        { error: 'Invalid cognitive state' },
        { status: 400 }
      );
    }

    // Update state
    await updateCognitiveState(user.id, cognitiveState);

    // Return updated session
    const session = await getCurrentSession(user.id);

    return NextResponse.json({
      session,
      message: 'Cognitive state updated'
    });
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}
