import React from 'react';
import type { AuthVariant } from '@/types/auth-layout';

interface AuthIllustrationProps {
  variant?: AuthVariant;
}

const AuthIllustration: React.FC<AuthIllustrationProps> = ({ variant = 'login' }) => {
  const accent = variant === 'register' ? '#fb7185' : '#38bdf8';
  const accentSoft = variant === 'register' ? 'rgba(251,113,133,0.35)' : 'rgba(56,189,248,0.35)';

  return (
  <svg
    viewBox="0 0 480 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-md mx-auto drop-shadow-2xl"
    aria-hidden
  >
    {/* Browser window */}
    <rect x="60" y="80" width="320" height="220" rx="16" fill="#1e1b4b" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    <rect x="60" y="80" width="320" height="36" rx="16" fill="#312e81" />
    <rect x="60" y="100" width="320" height="16" fill="#312e81" />
    <circle cx="82" cy="98" r="5" fill="#ef4444" fillOpacity="0.8" />
    <circle cx="100" cy="98" r="5" fill="#f59e0b" fillOpacity="0.8" />
    <circle cx="118" cy="98" r="5" fill="#22c55e" fillOpacity="0.8" />

    {/* Grid cells */}
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={80 + col * 72}
          y={130 + row * 52}
          width="64"
          height="40"
          rx="8"
          fill={row === 0 && col === 1 ? accentSoft : 'rgba(255,255,255,0.06)'}
          stroke="rgba(255,255,255,0.08)"
        />
      ))
    )}

    {/* Chart bars */}
    <rect x="92" y="155" width="12" height="28" rx="3" fill="#8b5cf6" fillOpacity="0.6" />
    <rect x="110" y="145" width="12" height="38" rx="3" fill={accent} fillOpacity="0.85" />
    <rect x="128" y="160" width="12" height="23" rx="3" fill="#8b5cf6" fillOpacity="0.5" />

    {/* Character 1 — simplified */}
    <ellipse cx="130" cy="268" rx="28" ry="8" fill="rgba(0,0,0,0.2)" />
    <circle cx="130" cy="230" r="22" fill="#f8fafc" />
    <path d="M108 255 Q130 275 152 255 L152 290 L108 290 Z" fill="#6366f1" />
    <circle cx="122" cy="228" r="2" fill="#1e293b" />
    <circle cx="138" cy="228" r="2" fill="#1e293b" />

    {/* Character 2 */}
    <ellipse cx="300" cy="275" rx="26" ry="7" fill="rgba(0,0,0,0.2)" />
    <circle cx="300" cy="238" r="20" fill="#f8fafc" />
    <path d="M282 260 Q300 278 318 260 L318 292 L282 292 Z" fill="#ec4899" />
    <rect x="318" y="220" width="24" height="32" rx="4" fill="#34d399" fillOpacity="0.9" />

    {/* Plant */}
    <path d="M370 290 L370 260 Q375 240 380 255 Q385 235 390 250 Q395 240 400 260 L400 290 Z" fill="#22c55e" fillOpacity="0.7" />
    <rect x="365" y="288" width="40" height="14" rx="4" fill="#78350f" fillOpacity="0.8" />

    {/* Floating lead card */}
    <rect x="320" y="120" width="90" height="48" rx="10" fill={accentSoft} stroke={accent} strokeOpacity="0.5" />
    <text x="332" y="142" fill={accent} fontSize="10" fontFamily="system-ui">Qualified</text>
    <text x="332" y="158" fill="#f1f5f9" fontSize="11" fontFamily="system-ui" fontWeight="600">+24 leads</text>
  </svg>
  );
};

export default AuthIllustration;
