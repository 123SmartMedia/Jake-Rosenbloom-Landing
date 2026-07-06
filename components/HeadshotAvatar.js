'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HeadshotAvatar() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="avatar">
      {!failed && (
        <Image
          src="/jake-headshot.jpg"
          alt="Jake Rosenbloom, loan officer"
          width={54}
          height={54}
          onError={() => setFailed(true)}
        />
      )}
      {failed && <div className="ini">JR</div>}
    </div>
  );
}
