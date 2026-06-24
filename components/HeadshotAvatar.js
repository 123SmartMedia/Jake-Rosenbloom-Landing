'use client';

import { useState } from 'react';

export default function HeadshotAvatar() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="avatar">
      {!failed && (
        <img
          src="/jake-headshot.jpg"
          alt="Jake Rosenbloom, loan officer"
          onError={() => setFailed(true)}
        />
      )}
      {failed && <div className="ini">JR</div>}
    </div>
  );
}
