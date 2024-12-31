'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Gamepad2, Grid } from 'lucide-react';

const JeuxPage: FC = () => {
  const jeux = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Retrouve les paires de cartes identiques et développe ta mémoire visuelle',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      gradient: 'from-purple-500/20 to-blue-500/20',
      textColor: 'text-purple-400',
    },
    {
      id: 'simon',
      title: 'Simon',
      description: 'Reproduis la séquence de couleurs et de sons pour tester ta mémoire',
      icon: <Gamepad2 className="w-8 h-8 text-green-400" />,
      gradient: 'from-green-500/20 to-teal-500/20',
      textColor: 'text-green-400',
    },
    {
      id: 'sudoku',
      title: 'Sudoku Junior',
      description: 'Résous des grilles de logique adaptées à ton niveau',
      icon: <Grid className="w-8 h-8 text-blue-400" />,
      gradient: 'from-blue-500/20 to-indigo-500/20',
      textColor: 'text-blue-400',
    },
  ];

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Jeux Éducatifs
          </h1>
          <p className="text-xl text-white/70">
            Développe tes capacités tout en t'amusant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jeux.map((jeu) => (
            <Link 
              key={jeu.id}
              href={`/jeux/${jeu.id}`} 
              className="glass-card p-8 hover:scale-[1.02] transition-transform"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-center mb-6">
                  <div className={`rounded-full bg-gradient-to-r ${jeu.gradient} p-4`}>
                    {jeu.icon}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">{jeu.title}</h2>
                <p className="text-white/70 text-center flex-grow">
                  {jeu.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default JeuxPage;
