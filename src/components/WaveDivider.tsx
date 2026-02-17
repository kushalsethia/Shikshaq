import React from 'react';

interface WaveDividerProps {
  fillColor: string;
  bgColor: string;
  inverted?: boolean;
}

export function WaveDivider({ fillColor, bgColor, inverted = false }: WaveDividerProps) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        height: '48px',
        width: '100%',
        overflow: 'hidden',
        margin: '0',
        padding: '0',
        display: 'block',
        lineHeight: '0'
      }}
    >
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="xMidYMid slice"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          margin: '0',
          padding: '0',
          transform: inverted ? 'scaleY(-1)' : 'none',
          verticalAlign: 'bottom'
        }}
      >
        <path
          d="M0,24 Q15,12 30,24 T60,24 T90,24 T120,24 T150,24 T180,24 T210,24 T240,24 T270,24 T300,24 T330,24 T360,24 T390,24 T420,24 T450,24 T480,24 T510,24 T540,24 T570,24 T600,24 T630,24 T660,24 T690,24 T720,24 T750,24 T780,24 T810,24 T840,24 T870,24 T900,24 T930,24 T960,24 T990,24 T1020,24 T1050,24 T1080,24 T1110,24 T1140,24 T1170,24 T1200,24 L1200,48 L0,48 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
