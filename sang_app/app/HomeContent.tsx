'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Appbar from '@/components/Appbar';
import EntryBox from '@/components/EntryBox';
import Queue from '@/components/Queue';
import VideoContainer from '@/components/Videocont';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  votes: number;
}

// Helper to generate a 4-character session code (2 letters + 2 digits)
function generateSessionCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 2; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read session code from URL (if available)
  const sessionCodeFromUrl = searchParams.get('session');
  const [sessionCode, setSessionCode] = useState<string>(sessionCodeFromUrl || '');
  const [newSessionCode, setNewSessionCode] = useState<string>('');

  // If no session code exists, generate one and update the URL.
  useEffect(() => {
    if (!sessionCode) {
      const code = generateSessionCode();
      setSessionCode(code);
      router.replace(`?session=${code}`);
    }
  }, [sessionCode, router]);

  // Local state for queue, current video, and the video URL input.
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  // Function to load the session queue from your backend.
  async function loadSessionQueue(code: string) {
    if (!code) return;
    const res = await fetch(`/api/session/${code}`);
    if (!res.ok) {
      console.error('Failed to load session queue');
      return;
    }
    const data = await res.json();
    if (data?.queue) {
      setQueue(data.queue);
    }
  }

  // Load the session queue on initial mount and when sessionCode changes.
  useEffect(() => {
    if (sessionCode) {
      loadSessionQueue(sessionCode);
    }
  }, [sessionCode]);

  // Poll every 3 seconds so that updates show up globally.
  useEffect(() => {
    if (!sessionCode) return;
    const interval = setInterval(() => {
      loadSessionQueue(sessionCode);
    }, 3000);
    return () => clearInterval(interval);
  }, [sessionCode]);

  // A simple fetch for video metadata (placeholder).
  const fetchVideoData = async (videoId: string) => {
    return {
      title: `Video Title for ${videoId}`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
    };
  };

  // Add video to the queue with a duplicate check.
  const addVideoToQueue = async () => {
    if (queue.length >= 10) {
      alert('Queue is full (max 10 videos).');
      return;
    }
    const videoIdMatch = videoUrl.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]+)/);
    if (!videoIdMatch) {
      alert('Invalid YouTube URL.');
      return;
    }
    const videoId = videoIdMatch[1];
    const alreadyInQueue = queue.find((v) => v.id === videoId);
    if (alreadyInQueue) {
      alert('Video already in queue!');
      return;
    }
    const meta = await fetchVideoData(videoId);
    if (!meta) {
      alert('Unable to retrieve video details.');
      return;
    }
    const res = await fetch(`/api/session/${sessionCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        id: videoId,
        title: meta.title,
        thumbnail: meta.thumbnail,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      alert(`Failed to add video: ${errorData.error || 'Unknown error'}`);
      return;
    }
    const data = await res.json();
    if (data?.queue) {
      setQueue(data.queue);
    }
    setVideoUrl('');
  };

  // Handle voting on a video.
  const handleVote = async (videoId: string, delta: number) => {
    const res = await fetch(`/api/session/${sessionCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vote', videoId, delta }),
    });
    if (!res.ok) {
      alert('Failed to vote.');
      return;
    }
    const data = await res.json();
    if (data?.queue) {
      setQueue(data.queue);
    }
  };

  // "Play Next" action: remove the highest-voted video.
  const playNext = async () => {
    if (queue.length === 0) {
      alert('Queue is empty.');
      return;
    }
    const sortedQueue = [...queue].sort((a, b) => b.votes - a.votes);
    const nextVideo = sortedQueue[0];
    setCurrentVideo(nextVideo);
    const res = await fetch(`/api/session/${sessionCode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'play', videoId: nextVideo.id }),
    });
    if (!res.ok) {
      alert('Failed to update queue on server.');
      return;
    }
    const data = await res.json();
    if (data?.queue) {
      setQueue(data.queue);
    }
  };

  // Change session code based on user input.
  const changeSessionCode = () => {
    if (!newSessionCode.trim()) return;
    const code = newSessionCode.trim().toUpperCase();
    setSessionCode(code);
    router.replace(`?session=${code}`);
    setNewSessionCode('');
  };

  return (
    <div>
      <Appbar />
      <div className="p-5">
        <strong>Session Code:</strong> {sessionCode}
        <div className="mt-2 flex items-center">
          <input
            type="text"
            value={newSessionCode}
            onChange={(e) => setNewSessionCode(e.target.value)}
            placeholder="Enter new session code"
            className="border border-gray-300 p-2 mr-2 rounded w-40"
          />
          <button
            onClick={changeSessionCode}
            className="px-3 py-2 bg-blue-500 text-white rounded"
          >
            Change Session Code
          </button>
        </div>
      </div>
      <EntryBox
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        addVideoToQueue={addVideoToQueue}
      />
      <Queue queue={queue} handleVote={handleVote} />
      <VideoContainer currentVideo={currentVideo} playNext={playNext} />
    </div>
  );
}
