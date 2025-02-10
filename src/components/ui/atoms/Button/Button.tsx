import React, { FC } from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'outline' | 'solid';
  onClick?: () => void;
  className?: string;
}

export const Button: FC<ButtonProps> = ({ children, href, variant = 'solid', onClick, className }) => {
  const baseClass = "px-4 py-2 rounded";
  const variantClass = variant === 'outline' ? "border border-blue-500 text-blue-500" : "bg-blue-500 text-white";
  const combinedClassName = `${baseClass} ${variantClass} ${className || ""}`;

  if (href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
};
