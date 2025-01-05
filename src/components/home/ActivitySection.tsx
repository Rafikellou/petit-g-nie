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
        className="mb-8 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">{title}</h2>
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
              className="block glass-card hover:scale-[1.02] transition-all hover:shadow-lg relative overflow-hidden rounded-2xl bg-[#1a1f2e]/60 backdrop-blur-sm h-[180px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
              
              {/* Content */}
              <div className="relative p-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`rounded-full ${activity.bgGradient} p-4`}>
                    <activity.icon className={`w-8 h-8 ${activity.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{activity.title}</h3>
                    <p className="text-sm text-white/70">{activity.description}</p>
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