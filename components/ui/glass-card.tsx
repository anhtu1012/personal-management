import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle';
  glow?: 'sky' | 'purple' | 'green' | 'amber' | 'none';
}

export function GlassCard({ 
  className, 
  variant = 'default', 
  glow = 'none',
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl transition-all duration-300',
        {
          'glass': variant === 'default',
          'glass-strong': variant === 'strong',
          'glass-subtle': variant === 'subtle',
          'glow-sky': glow === 'sky',
          'glow-purple': glow === 'purple',
          'glow-green': glow === 'green',
          'glow-amber': glow === 'amber',
        },
        className
      )}
      {...props}
    />
  );
}
