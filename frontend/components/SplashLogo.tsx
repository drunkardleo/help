import React from 'react';
import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop, Filter, FeDropShadow } from 'react-native-svg';

interface SplashLogoProps {
  size?: number;
  color?: string;
}

export const SplashLogo: React.FC<SplashLogoProps> = ({ size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#1E293B" />
          <Stop offset="100%" stopColor="#0F172A" />
        </LinearGradient>
        <LinearGradient id="heartGradient" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FF4B4B" />
          <Stop offset="100%" stopColor="#E74C3C" />
        </LinearGradient>
        <LinearGradient id="crossGradient" x1="30" y1="30" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F8FAFC" />
        </LinearGradient>
      </Defs>

      {}
      <Rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill="url(#bgGradient)"
        stroke="#334155"
        strokeWidth="2"
      />

      {}
      <Circle cx="60" cy="60" r="42" fill="#EF4444" opacity="0.12" />

      {}
      <G fill="url(#crossGradient)">
        {}
        <Rect x="52" y="32" width="16" height="56" rx="8" />
        {}
        <Rect x="32" y="52" width="56" height="16" rx="8" />
      </G>

      {}
      <Path
        d="M60 69C60 69 44 58.5 44 49.5C44 44.5 48 41 52.5 41C55.5 41 58.2 42.6 60 45C61.8 42.6 64.5 41 67.5 41C72 41 76 44.5 76 49.5C76 58.5 60 69 60 69Z"
        fill="url(#heartGradient)"
      />
    </Svg>
  );
};
