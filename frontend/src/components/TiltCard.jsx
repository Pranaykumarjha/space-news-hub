import { useState, useRef } from 'react';

const TiltCard = ({ children, className = '', onClick }) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, dx: 0, dy: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse position relative to the card's bounding box
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    const xc = width / 2;
    const yc = height / 2;
    const dx = (x - xc) / xc;
    const dy = (y - yc) / yc;

    setCoords({ x, y, dx, dy });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCoords({ x: 0, y: 0, dx: 0, dy: 0 });
  };

  // Max tilt angle (degrees)
  const maxTilt = 8;
  const rotateX = isHovering ? -(coords.dy * maxTilt) : 0;
  const rotateY = isHovering ? coords.dx * maxTilt : 0;
  
  // Reflection/Glare style
  const glareStyle = isHovering ? {
    background: `radial-gradient(circle 180px at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)`
  } : {};

  const cardStyle = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.015 : 1}, ${isHovering ? 1.015 : 1}, 1)`,
    transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative'
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={cardStyle}
      className={className}
    >
      {/* Dynamic Glare Overlay — z-index 0 so it never blocks child buttons */}
      <div 
        className="card-glare-effect"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: 'inherit',
          transition: isHovering ? 'none' : 'background 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          ...glareStyle
        }}
      />
      {children}
    </div>
  );
};

export default TiltCard;
