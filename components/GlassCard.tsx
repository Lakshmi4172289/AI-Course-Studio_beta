import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  onClick,
  hoverEffect = false 
}) => {
  return (
    <motion.div 
      onClick={onClick}
      whileHover={hoverEffect ? { scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.2)" } : {}}
      className={`glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );
};