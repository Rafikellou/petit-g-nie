import Link from 'next/link'
import { 
  BookOpen, 
  GraduationCap, 
  Headphones, 
  LightbulbIcon,
  Wand2,
  GamepadIcon,
  Languages,
  LucideIcon
} from 'lucide-react'

interface NavLink {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  isNew?: boolean;
  isComingSoon?: boolean;
  requiresAuth?: boolean;
}

const navigationLinks: NavLink[] = [
  {
    href: '/stories',
    title: 'Lire une Histoire',
    description: 'Découvre des histoires passionnantes et améliore ta lecture',
    icon: BookOpen,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-blue-500/20'
  },
  {
    href: '/listen',
    title: 'Écouter',
    description: 'Améliore ta compréhension orale avec des histoires audio',
    icon: Headphones,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    href: '/creer-histoire',
    title: 'Créer une Histoire',
    description: 'Laisse libre cours à ton imagination et crée tes propres histoires',
    icon: Wand2,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    isNew: true
  },
  {
    href: '/jeux',
    title: 'Jouer',
    description: "Apprends en t'amusannt avec nos jeux éducatifs",
    icon: GamepadIcon,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-rose-500/20'
  },
  {
    href: '/english',
    title: 'English Corner',
    description: 'Pratique ton anglais avec des exercices interactifs',
    icon: Languages,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    isComingSoon: true
  },
  {
    href: '/blagues',
    title: 'Blagues',
    description: 'Découvre notre collection de blagues et devinettes amusantes',
    icon: LightbulbIcon,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-red-500/20'
  },
  {
    href: '/dictee',
    title: 'Dictée',
    description: 'Entraîne-toi à la dictée avec notre assistant intelligent',
    icon: LightbulbIcon,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-yellow-500/20'
  },
  {
    href: '/quiz',
    title: 'Quiz',
    description: 'Teste tes connaissances avec des quiz amusants et éducatifs',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen safe-area-inset">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-safe-top pb-safe-bottom relative">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">
            Bienvenue sur Futur Génie !
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            Votre compagnon d'apprentissage intelligent et personnalisé
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {navigationLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`glass-card p-6 md:p-8 hover:scale-[1.02] transition-transform tap-target min-h-[180px] touch-manipulation relative ${
                link.isComingSoon ? 'opacity-50 pointer-events-none' : ''
              }`}
              role="button"
              aria-label={link.title}
            >
              {link.isNew && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs px-2 py-1 rounded-full">
                  Nouveau
                </span>
              )}
              {link.isComingSoon && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-white text-xs px-2 py-1 rounded-full">
                  Bientôt
                </span>
              )}
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-center mb-6">
                  <div className={`rounded-full bg-gradient-to-r ${link.bgGradient} p-4`}>
                    <link.icon className={`w-8 h-8 ${link.color}`} />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3 text-center">{link.title}</h2>
                <p className="text-base md:text-lg text-white/70 text-center flex-grow leading-relaxed">
                  {link.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
