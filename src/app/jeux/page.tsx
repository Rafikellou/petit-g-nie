'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Gamepad2, Grid, Trophy, Star, Clock } from 'lucide-react';

const JeuxPage: FC = () => {
  const jeux = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Retrouve les paires de cartes identiques',
      icon: Brain,
      color: 'purple',
      stats: {
        highScore: 1200,
        stars: 4,
        timeSpent: '45 min'
      }
    },
    {
      id: 'simon',
      title: 'Simon',
      description: 'Reproduis la séquence de couleurs et de sons',
      icon: Gamepad2,
      color: 'green',
      stats: {
        highScore: 850,
        stars: 3,
        timeSpent: '30 min'
      }
    },
    {
      id: 'puzzle',
      title: 'Puzzle',
      description: 'Reconstitue les images en déplaçant les pièces',
      icon: Grid,
      color: 'blue',
      stats: {
        highScore: 950,
        stars: 5,
        timeSpent: '1h 15min'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Jeux</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Choisis ton jeu</h2>
          <p className="text-white/70">Apprends en t'amusant avec nos jeux éducatifs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jeux.map((jeu) => {
            const IconComponent = jeu.icon;
            return (
              <Link
                key={jeu.id}
                href={`/jeux/${jeu.id}`}
                className="glass-card p-6 hover:bg-white/5 transition tap-target touch-manipulation"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-${jeu.color}-500/20 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${jeu.color}-400`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{jeu.title}</h3>
                    <p className="text-sm text-white/70">{jeu.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{jeu.stats.highScore}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{jeu.stats.stars}/5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white/70" />
                    <span className="text-sm">{jeu.stats.timeSpent}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Section des succès */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Tes succès</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="font-medium">3000</p>
              <p className="text-sm text-white/70">Score total</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="font-medium">12</p>
              <p className="text-sm text-white/70">Étoiles gagnées</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <Clock className="w-8 h-8 text-white/70 mx-auto mb-2" />
              <p className="font-medium">2h 30min</p>
              <p className="text-sm text-white/70">Temps de jeu</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <Gamepad2 className="w-8 h-8 text-white/70 mx-auto mb-2" />
              <p className="font-medium">15</p>
              <p className="text-sm text-white/70">Parties jouées</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JeuxPage;
