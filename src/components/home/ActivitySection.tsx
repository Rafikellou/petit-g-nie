'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Activity {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  isNew?: boolean;
  isComingSoon?: boolean;
  recommendedDaysAgo?: number;
  teacherMessage?: string;
  progress?: number;
}

interface ActivitySectionProps {
  title: string;
  description?: string;
  activities: Activity[];
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

export function ActivitySection({ title, description, activities }: ActivitySectionProps) {
  return (
    <section className="mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-white/70">{description}</p>
        )}
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {activities.map((activity) => (
          <motion.div key={activity.href} variants={item}>
            <Link
              href={activity.href}
              className={`glass-card p-4 hover:scale-[1.02] transition-all hover:shadow-lg tap-target touch-manipulation relative overflow-hidden ${
                activity.isComingSoon ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {activity.isNew && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
              {activity.isComingSoon && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-xs px-2 py-1 rounded-full">
                  Bientôt
                </span>
              )}
              {activity.recommendedDaysAgo !== undefined && (
                <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white text-xs px-2 py-1 rounded-full">
                    Recommandé il y a {activity.recommendedDaysAgo} jour{activity.recommendedDaysAgo > 1 ? 's' : ''}
                  </span>
                  {activity.teacherMessage && (
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs px-2 py-1 rounded-full max-w-[200px] truncate">
                      "{activity.teacherMessage}"
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-4">
                <div className={`rounded-full bg-gradient-to-r ${activity.bgGradient} p-3 flex-shrink-0`}>
                  <activity.icon className={`w-6 h-6 ${activity.color}`} />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold mb-1">{activity.title}</h3>
                  <p className="text-sm text-white/70">{activity.description}</p>
                  {activity.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${activity.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-white/50 mt-1">
                        Progression : {activity.progress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
