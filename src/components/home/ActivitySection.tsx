'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Activity {
  href: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  isCompleted?: boolean;
}

interface ActivitySectionProps {
  title: string;
  description?: string;
  activities: Activity[];
  isMainTitle?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ActivitySection({ title, description, activities, isMainTitle }: ActivitySectionProps) {
  return (
    <section className="mb-8 md:mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8 text-left md:text-center"
      >
        <h2 className={`font-bold mb-2 md:mb-3 ${
          isMainTitle 
            ? 'text-3xl md:text-5xl bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text' 
            : 'text-xl md:text-3xl text-white/90'
        }`}>{title}</h2>
        {description && (
          <p className="text-sm md:text-base text-white/70">{description}</p>
        )}
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {activities.map((activity) => (
          <motion.div key={activity.href} variants={item}>
            <Link
              href={activity.href}
              className={`block glass-card hover:scale-[1.02] transition-all hover:shadow-lg relative overflow-hidden rounded-xl md:rounded-2xl backdrop-blur-sm h-[140px] md:h-[180px] ${
                activity.isCompleted !== undefined
                  ? activity.isCompleted
                    ? 'bg-[#1a1f2e]/90 opacity-75'
                    : 'bg-[#1a1f2e]/60'
                  : 'bg-[#1a1f2e]/60'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              
              {/* Content */}
              <div className="relative p-4 md:p-6">
                <div className="flex flex-row md:flex-col items-center md:text-center gap-4">
                  <div className={`rounded-full ${activity.bgGradient} p-3 md:p-4`}>
                    <activity.icon className={`w-6 h-6 md:w-8 md:h-8 ${activity.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-white">{activity.title}</h3>
                    {activity.description && (
                      <p className="text-sm text-white/70 mt-1 line-clamp-2 md:line-clamp-none">
                        {activity.description}
                      </p>
                    )}
                    {activity.isCompleted !== undefined && (
                      <div className={`absolute top-4 right-4 rounded-full p-2 ${
                        activity.isCompleted 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/30 text-red-500'
                      }`}>
                        {activity.isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
