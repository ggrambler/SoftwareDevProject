// app/api/session/[sessionCode]/route.ts
import { NextResponse } from 'next/server';

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

// Declare the route context with params as a Promise.
interface SessionRouteContext {
  params: Promise<{ sessionCode: string }>;
}

export async function GET(
  request: Request,
  context: SessionRouteContext
) {
  // Await the promise for params.
  const { sessionCode } = await context.params;
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [] };
  }
  return NextResponse.json(sessions[sessionCode]);
}

export async function POST(
  request: Request,
  context: SessionRouteContext
) {
  const { sessionCode } = await context.params;
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [] };
  }
  const body = await request.json();
  const { action } = body;

  if (action === 'add') {
    const { id, title, thumbnail } = body;
    if (sessions[sessionCode].queue.some((video) => video.id === id)) {
      return NextResponse.json(
        { error: 'Video already in queue' },
        { status: 400 }
      );
    }
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

  if (action === 'vote') {
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

  if (action === 'play') {
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
