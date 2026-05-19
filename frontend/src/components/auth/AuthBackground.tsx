import React from 'react';

const AuthBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,_oklch(0.55_0.22_25_/_0.18),_transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,_oklch(0.45_0.18_25_/_0.12),_transparent_45%)]" />
    <div
      className="auth-orb-1 absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-red-500/15 blur-[100px]"
    />
    <div
      className="auth-orb-2 absolute top-1/2 -right-32 w-[380px] h-[380px] rounded-full bg-red-600/10 blur-[90px]"
    />
    <div
      className="auth-orb-1 absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-orange-500/8 blur-[80px]"
      style={{ animationDelay: '-4s' }}
    />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}
    />
  </div>
);

export default AuthBackground;
