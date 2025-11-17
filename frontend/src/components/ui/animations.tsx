import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from './luxury-card';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ children, className }) => {
  return (
    <div className={cn("relative min-h-screen bg-gray-900 overflow-hidden", className)}>
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.3),rgba(255,255,255,0)_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.3),rgba(255,255,255,0)_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),rgba(255,255,255,0)_50%)]" />
        </motion.div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ count = 50, className }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ 
  text, 
  className, 
  delay = 0, 
  staggerDelay = 0.1 
}) => {
  const words = text.split(' ');
  
  return (
    <div className={cn("flex flex-wrap", className)}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + wordIndex * staggerDelay,
            ease: "easeOut",
          }}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

interface MagneticCursorProps {
  children: React.ReactNode;
}

export const MagneticCursor: React.FC<MagneticCursorProps> = ({ children }) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = React.useState('default');

  React.useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', mouseMove);
    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  const variants = {
    default: {
      height: 20,
      width: 20,
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      mixBlendMode: 'difference' as const,
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
    },
    text: {
      height: 80,
      width: 80,
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      mixBlendMode: 'difference' as const,
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
    },
  };

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50"
        variants={variants}
        animate={cursorVariant}
        transition={{ duration: 0.1 }}
      />
      <div
        onMouseEnter={() => setCursorVariant('text')}
        onMouseLeave={() => setCursorVariant('default')}
      >
        {children}
      </div>
    </div>
  );
};