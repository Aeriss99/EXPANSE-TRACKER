'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hover = true,
  delay = 0,
  onClick,
}) => {
  return (
    <div
      className={cn(
        'card animate-fade-in',
        hover && 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
