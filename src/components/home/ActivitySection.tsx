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
    <section className="mb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        {description && (
          <p className="text-lg text-white/70">{description}</p>
        )}
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {activities.map((activity) => (
          <motion.div key={activity.href} variants={item}>
            <Link
              href={activity.href}
              className="block glass-card hover:scale-[1.02] transition-all hover:shadow-lg relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm h-[180px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.075] to-white/[0.025]" />
              
              {/* Badges */}
              <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                {activity.isNew && (
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-sm px-3 py-1 rounded-full font-medium">
                    Nouveau
                  </span>
                )}
                {activity.isComingSoon && (
                  <span className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-sm px-3 py-1 rounded-full font-medium">
                    Bientôt
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl bg-gradient-to-br ${activity.bgGradient} p-3 flex-shrink-0`}>
                    <activity.icon className={`w-6 h-6 ${activity.color}`} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-xl font-semibold mb-2 text-white">{activity.title}</h3>
                    <p className="text-base text-white/70">{activity.description}</p>
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
