import { useState } from "react";

interface FlipCardProps {
  front: string;
  back: string;
}

export function FlipCard({ front, back }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flip-card" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-front">
          <p className="text-lg text-stone-800 text-center">{front}</p>
        </div>
        <div className="flip-card-back">
          <p className="text-lg text-stone-800 text-center">{back}</p>
        </div>
      </div>
    </div>
  );
}
