'use client';

import { BookOpen, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

const trainingTypes = [
  {
    title: 'Questions des quizs',
    description: 'Gérer et adapter les questions des quiz',
    icon: BookOpen,
    href: '/teacher/training/quiz',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/40 to-yellow-800/40'
  },
  {
    title: 'Texte des dictées',
    description: 'Gérer et adapter les textes des dictées',
    icon: PenTool,
    href: '/teacher/training/dictee',
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

export default function TrainingPage() {
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Adapter l&apos;entrainement
        </h1>
        <p className="text-gray-400">
          Personnalisez le contenu des activités d&apos;entrainement
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {trainingTypes.map((type) => (
          <motion.a
            key={type.href}
            href={type.href}
            variants={item}
            className="block p-6 rounded-xl bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-200 border border-gray-800 hover:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-full ${type.bgGradient} p-4`}>
                <type.icon className={`w-6 h-6 ${type.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {type.description}
                </p>
              </div>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
