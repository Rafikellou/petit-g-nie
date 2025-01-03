'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DicteeInteractive } from '@/components/dictee/DicteeInteractive';

// Texte de démonstration (à remplacer par une vraie base de données)
const demoText = "L'été dernier, nous sommes allés en vacances à la mer. Le soleil brillait tous les jours, et nous avons passé beaucoup de temps à nager et à construire des châteaux de sable.";

const DicteePage: FC = () => {
  const [userInput, setUserInput] = useState('');

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Dictée Interactive
          </h1>
          <p className="text-white/70 text-lg">
            Écoutez attentivement et écrivez ce que vous entendez
          </p>
        </div>

        <div className="card max-w-3xl mx-auto">
          <DicteeInteractive
            text={demoText}
            onInputChange={setUserInput}
          />
        </div>
      </div>
    </main>
  );
};

export default DicteePage;
