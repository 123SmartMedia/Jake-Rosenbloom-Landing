'use client';

import { useRef, useState } from 'react';

export default function VideoBackground({ src, poster }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted]     = useState(false);

  function play() {
    if (!videoRef.current) return;
    videoRef.current.play();
    setPlaying(true);
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }

  return (
    <div className="video-col">
      <div className="video-frame">
        <video
          ref={videoRef}
          playsInline
          preload="none"
          poster={poster}
          className="hero-video"
          aria-label="Jake Rosenbloom introduction video"
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>

        <div className="video-overlay" aria-hidden="true" />

        {/* Play button — shown until user taps */}
        {!playing && (
          <button className="video-play-btn" onClick={play} aria-label="Play video">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}

        {/* Mute toggle — shown only while video is playing */}
        {playing && (
          <button
            className="video-mute-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
