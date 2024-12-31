import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MenuCardProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  description: string;
  className?: string;
}

export const MenuCard: FC<MenuCardProps> = ({
  title,
  icon,
  href,
  description,
  className
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col items-center justify-center p-6 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-200 border border-slate-700 hover:border-slate-600',
        'hover:scale-105 hover:shadow-xl',
        className
      )}
    >
      <div className="text-4xl mb-4 text-turquoise-500 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-100">{title}</h3>
      <p className="text-sm text-slate-400 text-center">{description}</p>
    </Link>
  );
};
