import React from 'react';

interface WaveDividerProps {
  fillColor: string;
  bgColor: string;
  inverted?: boolean;
}

export function WaveDivider({ fillColor, bgColor, inverted = false }: WaveDividerProps) {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        height: '60px'
      }}
    >
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          transform: inverted ? 'scaleY(-1)' : 'none'
        }}
      >
        <path
          d="M 0 20 Q 10 10 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20 T 220 20 T 240 20 T 260 20 T 280 20 T 300 20 T 320 20 T 340 20 T 360 20 T 380 20 T 400 20 T 420 20 T 440 20 T 460 20 T 480 20 T 500 20 T 520 20 T 540 20 T 560 20 T 580 20 T 600 20 T 620 20 T 640 20 T 660 20 T 680 20 T 700 20 T 720 20 T 740 20 T 760 20 T 780 20 T 800 20 T 820 20 T 840 20 T 860 20 T 880 20 T 900 20 T 920 20 T 940 20 T 960 20 T 980 20 T 1000 20 T 1020 20 T 1040 20 T 1060 20 T 1080 20 T 1100 20 T 1120 20 T 1140 20 T 1160 20 T 1180 20 T 1200 20 L 1200 40 L 0 40 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
