import { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    let dust = [];
    let shootingStars = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse position for parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initSpace();
    };

    window.addEventListener('resize', handleResize);

    // Initialize stars and cosmic dust
    const initSpace = () => {
      stars = [];
      dust = [];
      shootingStars = [];
      
      const starCount = Math.min(Math.floor((width * height) / 7000), 220);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.4 + 0.4,
          speedX: (Math.random() - 0.5) * 0.08,
          speedY: (Math.random() - 0.5) * 0.08 - 0.04, // Subtle upward drift
          alpha: Math.random() * 0.7 + 0.3,
          color: Math.random() > 0.85 ? '#a5f3fc' : '#ffffff', // 15% cyan stars, 85% white
        });
      }

      // Cosmic dust particles (larger, slow moving, highly transparent glow circles)
      const dustCount = Math.min(Math.floor((width * height) / 35000), 30);
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 40 + 20,
          speedX: (Math.random() - 0.5) * 0.02,
          speedY: (Math.random() - 0.5) * 0.02 - 0.01,
          alpha: Math.random() * 0.04 + 0.01,
          color: Math.random() > 0.5 ? 'rgba(6, 182, 212, ' : 'rgba(168, 85, 247, ', // Cyan or Purple
        });
      }
    };

    initSpace();

    // Spawns a shooting star
    const spawnShootingStar = () => {
      if (Math.random() < 0.0015 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.4),
          len: Math.random() * 80 + 40,
          speed: Math.random() * 10 + 8,
          dx: Math.random() * 2 + 6,  // Rapid right-down diagonal
          dy: Math.random() * 2 + 3,
          alpha: 1,
          color: Math.random() > 0.5 ? '#a5f3fc' : '#ffffff',
        });
      }
    };

    // Draw nebula glows
    const drawNebulae = () => {
      ctx.save();
      // Nebula 1 (Deep Purple)
      const grad1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.25,
        0,
        width * 0.25,
        height * 0.25,
        Math.min(width, height) * 0.7
      );
      grad1.addColorStop(0, 'rgba(124, 58, 237, 0.06)');
      grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Nebula 2 (Teal/Blue)
      const grad2 = ctx.createRadialGradient(
        width * 0.75,
        height * 0.75,
        0,
        width * 0.75,
        height * 0.75,
        Math.min(width, height) * 0.8
      );
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
      grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    // Animation Loop
    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 7, 1)'; // Deep outer space color
      ctx.fillRect(0, 0, width, height);

      // Render nebula backdrop
      drawNebulae();

      // Smooth mouse interpolation for parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const parallaxX = (mouse.x - width / 2) * 0.02;
      const parallaxY = (mouse.y - height / 2) * 0.02;

      // Update and draw cosmic dust (drawn behind stars)
      dust.forEach((d) => {
        d.x += d.speedX;
        d.y += d.speedY;

        // Wrap around screen
        const displayX = (d.x - parallaxX * 0.2 + width) % width;
        const displayY = (d.y - parallaxY * 0.2 + height) % height;

        ctx.save();
        const grad = ctx.createRadialGradient(displayX, displayY, 0, displayX, displayY, d.size);
        grad.addColorStop(0, `${d.color}${d.alpha})`);
        grad.addColorStop(1, `${d.color}0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(displayX, displayY, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Update and draw stars
      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap stars around boundaries
        const displayX = (star.x - parallaxX * star.size + width) % width;
        const displayY = (star.y - parallaxY * star.size + height) % height;

        // Twinkle effect
        star.alpha += (Math.random() - 0.5) * 0.04;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.9) star.alpha = 0.9;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(displayX, displayY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0; // Reset alpha

      // Update and draw shooting stars
      spawnShootingStar();
      shootingStars = shootingStars.filter((ss) => {
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.alpha -= 0.02; // Fade out slowly

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          return false;
        }

        ctx.save();
        ctx.globalAlpha = ss.alpha;
        ctx.strokeStyle = ss.color;
        ctx.lineWidth = 1.5;
        
        // Draw tail gradient
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.dx * 8, ss.y - ss.dy * 8);
        grad.addColorStop(0, ss.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.strokeStyle = grad;
        
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.dx * 8, ss.y - ss.dy * 8);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
};

export default Starfield;
