'use client';

import { GraduationCap, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

const activities = [
  {
    title: 'Quiz',
    description: 'Créer un nouveau quiz pour vos élèves',
    icon: GraduationCap,
    href: '/teacher/quiz/create',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/40 to-yellow-800/40'
  },
  {
    title: 'Dictée',
    description: 'Créer une nouvelle dictée',
    icon: PenTool,
    href: '/teacher/dictee/create',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-900/40 to-emerald-800/40'
  }
];

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

export default function TeacherDashboard() {
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Ajouter une activité
        </h1>
        <p className="text-gray-400">
          Créez de nouvelles activités pour vos élèves
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {activities.map((activity) => (
          <motion.a
            key={activity.href}
            href={activity.href}
            variants={item}
            className="block p-6 rounded-xl bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200 border border-gray-800 hover:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full ${activity.bgGradient} p-4`}>
                <activity.icon className={`w-6 h-6 ${activity.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {activity.description}
                </p>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
