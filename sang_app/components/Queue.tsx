// app/components/Queue.tsx
'use client';

import React from 'react';
import { Video } from '@/app/page';

interface QueueProps {
  queue: Video[];
  handleVote: (videoId: string, delta: number) => void;
}

const Queue: React.FC<QueueProps> = ({ queue, handleVote }) => {
  return (
    <section
      className="
        p-5 
        transition-colors 
        duration-300 
        hover:bg-purple-600
      "
    >
      <h2 className="text-xl font-bold mb-4">Videos in Queue</h2>
      {queue.length === 0 && <p>No videos in the queue.</p>}
      {queue.map((video) => (
        <div
          key={video.id}
          className="
            flex 
            items-center 
            mb-4 
            p-2 
            border 
            rounded 
            bg-red-100 
            scale-95
            transition 
            transform 
            duration-200 
            hover:scale-100
            hover:bg-red-200
          "
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-24 mr-4"
          />
          <div className="flex-grow">
            <h3 className="font-semibold">{video.title}</h3>
            <p>Votes: {video.votes}</p>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => handleVote(video.id, +1)}
              className="
                mb-1 
                bg-green-500 
                text-white 
                px-2 
                rounded 
                transition-colors 
                duration-200 
                hover:bg-green-600
              "
            >
              +
            </button>
            <button
              onClick={() => handleVote(video.id, -1)}
              className="
                bg-red-500 
                text-white 
                px-2 
                rounded 
                transition-colors 
                duration-200 
                hover:bg-red-600
              "
            >
              -
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Queue;
