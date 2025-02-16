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
  currentVideo: Video | null;
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
  const { sessionCode } = await context.params;
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [], currentVideo: null };
  }
  return NextResponse.json(sessions[sessionCode]);
}

export async function POST(
  request: Request,
  context: SessionRouteContext
) {
  const { sessionCode } = await context.params;
  if (!sessions[sessionCode]) {
    sessions[sessionCode] = { queue: [], currentVideo: null };
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
      currentVideo: sessions[sessionCode].currentVideo,
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
      currentVideo: sessions[sessionCode].currentVideo,
    });
  }

  if (action === 'play') {
    // Instead of using a provided videoId,
    // compute the highest-voted video on the server.
    if (sessions[sessionCode].queue.length === 0) {
      sessions[sessionCode].currentVideo = null;
    } else {
      const sortedQueue = [...sessions[sessionCode].queue].sort(
        (a, b) => b.votes - a.votes
      );
      const nextVideo = sortedQueue[0];
      sessions[sessionCode].currentVideo = nextVideo;
      sessions[sessionCode].queue = sessions[sessionCode].queue.filter(
        (video) => video.id !== nextVideo.id
      );
    }
    return NextResponse.json({
      success: true,
      queue: sessions[sessionCode].queue,
      currentVideo: sessions[sessionCode].currentVideo,
    });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
