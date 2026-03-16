'use client';
import { useEffect, useRef, memo } from 'react';

// ─── Canvas-based starfield ───────────────────────────────────
const StarCanvas = memo(function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth, h = window.innerHeight;

    canvas.width = w;
    canvas.height = h;

    // Star types
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      color: ['#ffffff', '#fffde7', '#e3f2fd', '#fce4ec'][Math.floor(Math.random() * 4)],
      type: Math.random() > 0.95 ? 'bright' : 'normal',
    }));

    // Shooting stars
    const shootingStars: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; active: boolean }[] = [];

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * w * 0.5,
        y: Math.random() * h * 0.3,
        vx: (Math.random() + 1) * 8,
        vy: (Math.random() + 0.5) * 4,
        life: 0, maxLife: 80 + Math.random() * 40,
        active: true,
      });
    }

    let shootTimer = 0;

    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);

      // Deep space gradient
      const grad = ctx!.createRadialGradient(w * 0.4, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h));
      grad.addColorStop(0, 'rgba(20, 8, 60, 1)');
      grad.addColorStop(0.4, 'rgba(8, 5, 30, 1)');
      grad.addColorStop(1, 'rgba(2, 2, 10, 1)');
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Nebula clouds
      const nebulae = [
        { x: w * 0.2, y: h * 0.3, r: 200, color: 'rgba(80, 20, 160, 0.06)' },
        { x: w * 0.75, y: h * 0.6, r: 250, color: 'rgba(20, 80, 160, 0.05)' },
        { x: w * 0.5, y: h * 0.1, r: 180, color: 'rgba(160, 40, 80, 0.04)' },
        { x: w * 0.1, y: h * 0.8, r: 220, color: 'rgba(40, 120, 60, 0.04)' },
      ];
      nebulae.forEach(n => {
        const g = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, n.color);
        g.addColorStop(1, 'transparent');
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();
      });

      // Stars
      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed;
        const opacity = s.type === 'bright'
          ? 0.6 + Math.sin(s.twinkle) * 0.4
          : 0.15 + Math.sin(s.twinkle) * 0.15;

        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba').replace('#ffffff', `rgba(255,255,255,${opacity})`).replace('#fffde7', `rgba(255,253,231,${opacity})`).replace('#e3f2fd', `rgba(227,242,253,${opacity})`).replace('#fce4ec', `rgba(252,228,236,${opacity})`);

        if (s.type === 'bright') {
          // Glow
          ctx!.shadowColor = s.color;
          ctx!.shadowBlur = 8;
        }
        ctx!.fill();
        ctx!.shadowBlur = 0;

        // Slow drift
        s.x += Math.sin(time * 0.0001 + s.twinkle) * 0.05;
        s.y += Math.cos(time * 0.0001 + s.twinkle) * 0.03;

        // Wrap
        if (s.x > w + 5) s.x = -5;
        if (s.x < -5) s.x = w + 5;
        if (s.y > h + 5) s.y = -5;
        if (s.y < -5) s.y = h + 5;
      });

      // Shooting stars
      shootTimer++;
      if (shootTimer > 200 + Math.random() * 300) {
        spawnShootingStar();
        shootTimer = 0;
      }

      shootingStars.forEach((ss, i) => {
        if (!ss.active) return;
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        const progress = ss.life / ss.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? (1 - progress) / 0.2 : 1;

        const len = 60 + ss.vx * 3;
        const grad = ctx!.createLinearGradient(ss.x - ss.vx * 5, ss.y - ss.vy * 5, ss.x, ss.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,250,220,${alpha * 0.9})`);

        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(ss.x - ss.vx * 5, ss.y - ss.vy * 5);
        ctx!.lineTo(ss.x, ss.y);
        ctx!.stroke();

        // Head glow
        ctx!.beginPath();
        ctx!.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,250,200,${alpha})`;
        ctx!.shadowColor = 'rgba(255,250,200,0.8)';
        ctx!.shadowBlur = 6;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        if (ss.life >= ss.maxLife) ss.active = false;
      });

      // Clean up dead shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (!shootingStars[i].active) shootingStars.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
});

// ─── Animated orbiting planets ────────────────────────────────
function OrbitingPlanets() {
  const planets = [
    { size: 12, color: '#FF8C42', shadow: '#FF8C42', orbitR: 320, duration: 25, delay: 0, label: '♄' },
    { size: 8,  color: '#74B9E6', shadow: '#74B9E6', orbitR: 420, duration: 40, delay: -10, label: '♃' },
    { size: 6,  color: '#E05252', shadow: '#E05252', orbitR: 250, duration: 18, delay: -5, label: '♂' },
    { size: 10, color: '#F472B6', shadow: '#F472B6', orbitR: 500, duration: 55, delay: -20, label: '♀' },
    { size: 5,  color: '#34D399', shadow: '#34D399', orbitR: 190, duration: 12, delay: -3, label: '☿' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Central glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,50,200,0.08) 0%, transparent 70%)',
      }}/>

      {planets.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: `${p.orbitR * 2}px`, height: `${p.orbitR * 2}px`,
          marginLeft: `-${p.orbitR}px`, marginTop: `-${p.orbitR}px`,
          borderRadius: '50%',
          border: `1px solid rgba(255,255,255,${0.04 + i * 0.01})`,
          animation: `spin-slow ${p.duration}s linear ${p.delay}s infinite`,
        }}>
          {/* Planet dot */}
          <div style={{
            position: 'absolute', top: '-1px', left: '50%',
            transform: 'translateX(-50%)',
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${p.color}, ${p.shadow}88)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}66`,
            animation: `spin-slow-rev ${p.duration}s linear ${p.delay}s infinite`,
          }}>
            <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '10px', color: p.color, opacity: 0.7 }}>{p.label}</span>
          </div>
        </div>
      ))}

      {/* Saturn rings (special) */}
      <div style={{
        position: 'absolute', top: '20%', right: '12%',
        width: '60px', height: '20px',
        border: '2px solid rgba(255,180,80,0.3)',
        borderRadius: '50%', transform: 'rotate(-15deg)',
        animation: 'spin-slow 30s linear infinite',
        opacity: 0.4,
      }}/>

      {/* Distant galaxy swirl */}
      <div style={{
        position: 'absolute', bottom: '15%', left: '8%',
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(120,60,200,0.15) 0%, transparent 70%)',
        animation: 'spin-slow 60s linear infinite',
        opacity: 0.6,
      }}/>
    </div>
  );
}

export default function SpaceBackground() {
  return (
    <>
      <StarCanvas />
      <OrbitingPlanets />
    </>
  );
}
