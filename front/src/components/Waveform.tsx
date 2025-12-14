import React from "react";

interface WaveformProps {
  isPlaying: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ isPlaying }) => (
  <div className="flex items-center gap-0.5 h-6 w-full max-w-[100px]">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className={`w-1 rounded-full bg-slate-800 transition-all duration-300 ease-in-out ${isPlaying ? "animate-pulse" : ""
          }`}
        style={{
          height: isPlaying ? `${Math.max(30, Math.random() * 100)}%` : "20%",
          opacity: isPlaying ? 1 : 0.3,
          animationDelay: `${i * 0.05}s`,
          transition: "height 0.2s ease",
        }}
      />
    ))}
  </div>
);
