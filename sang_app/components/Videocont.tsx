
'use client';

import React from 'react';
import { Video } from '@/app/HomeContent';

interface VideoContainerProps {
  currentVideo: Video | null;
  playNext: () => void;
}

const VideoContainer: React.FC<VideoContainerProps> = ({ currentVideo, playNext }) => {
  return (
    <section className="p-5">
      <h2 className="text-xl font-bold mb-4">Now Playing</h2>
      {currentVideo ? (
        <div>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={currentVideo.title}
          ></iframe>
        </div>
      ) : (
        <p>No video playing.</p>
      )}
      <button
        onClick={playNext}
        className="mt-4 px-3 py-2 bg-purple-500 text-white rounded"
      >
        Play Next
      </button>
    </section>
  );
};

export default VideoContainer;
