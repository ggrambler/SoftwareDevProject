
'use client';

import React from 'react';

interface EntryBoxProps {
  videoUrl: string;
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  addVideoToQueue: () => Promise<void>;
}

const EntryBox: React.FC<EntryBoxProps> = ({ videoUrl, setVideoUrl, addVideoToQueue }) => {
  return (
    <section className="p-5">
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Enter YouTube URL"
        className="border border-gray-300 p-2 mr-2 rounded w-80"
      />
      <button
        onClick={addVideoToQueue}
        className="px-3 py-2 bg-blue-500 text-white rounded"
      >
        Add to Queue
      </button>
    </section>
  );
};

export default EntryBox;
