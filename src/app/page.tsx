import Link from 'next/link'
import { 
  BookOpen, 
  GraduationCap, 
  Headphones, 
  LightbulbIcon,
  Wand2,
  GamepadIcon,
  Languages
} from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Bienvenue sur Futur Génie !
          </h1>
          <p className="text-lg text-white/70">
            Votre compagnon d'apprentissage intelligent et personnalisé
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lire une histoire */}
          <Link href="/stories" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-4">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Lire une Histoire</h2>
              <p className="text-white/70 text-center flex-grow">
                Découvre des histoires passionnantes et améliore ta lecture
              </p>
            </div>
          </Link>

          {/* Écouter une histoire */}
          <Link href="/stories" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-green-500/20 to-teal-500/20 p-4">
                  <Headphones className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Écouter une Histoire</h2>
              <p className="text-white/70 text-center flex-grow">
                Plonge dans un monde d'histoires captivantes racontées par nos personnages
              </p>
            </div>
          </Link>

          {/* Quiz */}
          <Link href="/quiz" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4">
                  <GraduationCap className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Quiz</h2>
              <p className="text-white/70 text-center flex-grow">
                Teste tes connaissances avec des quiz amusants et éducatifs
              </p>
            </div>
          </Link>

          {/* Blagues */}
          <Link href="/blagues" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 p-4">
                  <LightbulbIcon className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Blagues</h2>
              <p className="text-white/70 text-center flex-grow">
                Découvre notre collection de blagues et devinettes amusantes
              </p>
            </div>
          </Link>

          {/* Créer une histoire */}
          <Link href="/creer-histoire" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-4">
                  <Wand2 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Créer une Histoire</h2>
              <p className="text-white/70 text-center flex-grow">
                Crée tes propres histoires avec notre assistant IA
              </p>
            </div>
          </Link>

          {/* Apprendre l'anglais */}
          <Link href="/english" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-pink-500/20 to-red-500/20 p-4">
                  <Languages className="w-8 h-8 text-pink-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Apprendre l&apos;Anglais</h2>
              <p className="text-white/70 text-center flex-grow">
                Découvre et apprends les mots essentiels en anglais de façon interactive
              </p>
            </div>
          </Link>

          {/* Dictée */}
          <Link href="/dictee" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-4">
                  <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H16M8 4V6C8 7.10457 8.89543 8 10 8H14C15.1046 8 16 7.10457 16 6V4M8 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V16M12 16L14 14M12 16L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Dictée</h2>
              <p className="text-white/70 text-center flex-grow">
                Entraîne-toi à la dictée avec notre assistant intelligent
              </p>
            </div>
          </Link>

          {/* Jeux éducatifs */}
          <Link href="/jeux" className="glass-card p-8 hover:scale-[1.02]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center mb-6">
                <div className="rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 p-4">
                  <GamepadIcon className="w-8 h-8 text-violet-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-center">Jeux Éducatifs</h2>
              <p className="text-white/70 text-center flex-grow">
                Apprends en t'amusant avec nos jeux de mémoire, de logique et de séquence
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
