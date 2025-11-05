import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-200 p-6',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('mb-4', className)}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)}>{children}</h3>
  );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={cn('text-gray-600 mt-1', className)}>{children}</p>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('', className)}>{children}</div>;
};

