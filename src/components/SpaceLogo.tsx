'use client';

export default function SpaceLogo({ size = 120 }: { size?: number }) {
  return (
    <div className="logo-float" style={{ display: 'inline-block', width: size, height: size, position: 'relative' }}>
      {/* Outer ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '1px solid rgba(253,211,77,0.3)',
        animation: 'spin-slow 12s linear infinite',
      }}>
        {/* Small orbiting dot */}
        <div style={{
          position: 'absolute', top: '-3px', left: '50%', transform: 'translateX(-50%)',
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#FFD700', boxShadow: '0 0 8px #FFD700',
        }}/>
      </div>

      {/* Middle ring */}
      <div style={{
        position: 'absolute', inset: '12px', borderRadius: '50%',
        border: '1px solid rgba(168,85,247,0.4)',
        animation: 'spin-slow-rev 8s linear infinite',
      }}>
        <div style={{
          position: 'absolute', bottom: '-3px', left: '50%', transform: 'translateX(-50%)',
          width: '5px', height: '5px', borderRadius: '50%',
          background: '#a855f7', boxShadow: '0 0 6px #a855f7',
        }}/>
      </div>

      {/* Inner glow circle */}
      <div style={{
        position: 'absolute', inset: '22px', borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 35%, rgba(100,50,200,0.4), rgba(20,5,60,0.8))',
        boxShadow: 'inset 0 0 20px rgba(100,50,200,0.3), 0 0 30px rgba(100,50,200,0.2)',
      }}/>

      {/* Om symbol */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.38 + 'px',
        filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))',
      }} className="title-glow">
        🕉️
      </div>
    </div>
  );
}
