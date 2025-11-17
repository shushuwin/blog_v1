import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'neon';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = true,
  onClick,
}) => {
  const variants = {
    default: 'bg-gray-900 border border-gray-800',
    gradient: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border border-purple-500/20',
    glass: 'bg-gray-900/80 backdrop-blur-xl border border-white/10',
    neon: 'bg-gray-900 border-2 border-cyan-400/50 shadow-cyan-400/20 shadow-lg',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { 
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        transition: { duration: 0.3 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={cn(
        'rounded-2xl p-6 transition-all duration-300',
        variants[variant],
        'hover:border-white/20',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

interface LuxuryButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700',
    ghost: 'bg-transparent text-white hover:bg-white/10 border border-white/20',
    gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/25',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};