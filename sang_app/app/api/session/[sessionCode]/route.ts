// app/api/session/[sessionCode]/route.ts
import { NextResponse } from 'next/server';

// Our in-memory sessions store.
// Keys = sessionCode, Value = queue array
interface Video {
  id: string;
  title: string;
  thumbnail: string;
  votes: number;
}
interface SessionData {
  queue: Video[];
}

const sessions: Record<string, SessionData> = {};

/**
 * GET /api/session/[sessionCode]
 *  - Returns the current queue for the session.
 *
 * POST /api/session/[sessionCode]
 *  - Expects a JSON body with { action: string, ... }
 *  - action = 'add' to add a new video
 *    * requires { id: string, title: string, thumbnail: string }
 *  - action = 'vote' to vote on an existing video
 *    * requires { videoId: string, delta: number }
 *  - action = 'play' to mark a video as played (remove from queue)
 *    * requires { videoId: string }
 */
export async function GET(
  request: Request,
  context: { params: { sessionCode: string } }
) {
  // Await the params object before destructuring its properties
  const params = await Promise.resolve(context.params);
  const sessionCode = params.sessionCode;
  
  // If no session data exists yet, initialize it
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [] };
  }
  return NextResponse.json(sessions[sessionCode]);
}

export async function POST(
  request: Request,
  context: { params: { sessionCode: string } }
) {
  // Await the params object before using its properties
  const params = await Promise.resolve(context.params);
  const sessionCode = params.sessionCode;
  
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [] };
  }

  const body = await request.json();
  const { action } = body;

  // Handle "add" action: add a new video (if it doesn't already exist)
  if (action === 'add') {
    // e.g. { id, title, thumbnail }
    const { id, title, thumbnail } = body;
    // Check for duplicate: if the video is already in the queue, return an error.
    if (sessions[sessionCode].queue.some((video) => video.id === id)) {
      return NextResponse.json(
        { error: 'Video already in queue' },
        { status: 400 }
      );
    }
    // Add the new video with 0 votes
    sessions[sessionCode].queue.push({
      id,
      title,
      thumbnail,
      votes: 0,
    });
    return NextResponse.json({
      success: true,
      queue: sessions[sessionCode].queue,
    });
  }

  // Handle "vote" action: update votes on an existing video
  if (action === 'vote') {
    // e.g. { videoId, delta }
    const { videoId, delta } = body;
    sessions[sessionCode].queue = sessions[sessionCode].queue.map((video) =>
      video.id === videoId
        ? { ...video, votes: video.votes + delta }
        : video
    );
    return NextResponse.json({
      success: true,
      queue: sessions[sessionCode].queue,
    });
  }

  // Handle "play" action: remove the played video from the queue
  if (action === 'play') {
    // e.g. { videoId }
    const { videoId } = body;
    sessions[sessionCode].queue = sessions[sessionCode].queue.filter(
      (video) => video.id !== videoId
    );
    return NextResponse.json({
      success: true,
      queue: sessions[sessionCode].queue,
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
