import { PlusCircle, Brain, LineChart, Settings } from 'lucide-react';

export const tabs = [
  {
    name: 'Ajouter une activité',
    href: '/teacher',
    icon: PlusCircle
  },
  {
    name: 'Adapter l\'entrainement',
    href: '/teacher/training',
    icon: Brain
  },
  {
    name: 'Performances',
    href: '/teacher/performance',
    icon: LineChart
  },
  {
    name: 'Paramètres',
    href: '/teacher/settings',
    icon: Settings
  }
];
