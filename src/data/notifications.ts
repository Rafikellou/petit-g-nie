export interface Notification {
  id: string;
  userId: string;
  type: 'achievement' | 'reminder' | 'message' | 'report' | 'recommendation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: {
    type: 'report' | 'progress' | 'recommendation';
    data: any;
  }[];
}

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  type: 'weekly' | 'monthly' | 'custom';
  period: {
    start: string;
    end: string;
  };
  metrics: {
    storiesCompleted: number;
    quizzesTaken: number;
    averageScore: number;
    timeSpent: number;
    newBadges: string[];
    improvementAreas: string[];
    strengths: string[];
  };
  recommendations: string[];
  generatedAt: string;
}

// Données de test
export const mockNotifications: Record<string, Notification[]> = {
  'parent1': [
    {
      id: 'notif1',
      userId: 'parent1',
      type: 'achievement',
      title: 'Nouveau badge !',
      message: 'Lucas a obtenu le badge "Maître des Quiz" !',
      timestamp: '2024-12-07T15:30:00Z',
      read: false,
      actionUrl: '/parent/achievements'
    },
    {
      id: 'notif2',
      userId: 'parent1',
      type: 'report',
      title: 'Rapport hebdomadaire disponible',
      message: 'Le rapport de progression de Lucas pour cette semaine est disponible.',
      timestamp: '2024-12-07T08:00:00Z',
      read: true,
      actionUrl: '/parent/reports'
    }
  ],
  'teacher1': [
    {
      id: 'notif3',
      userId: 'teacher1',
      type: 'recommendation',
      title: 'Recommandation pour Emma',
      message: 'Emma pourrait bénéficier d\'exercices supplémentaires en compréhension.',
      timestamp: '2024-12-07T10:15:00Z',
      read: false,
      actionUrl: '/teacher/students/student2'
    }
  ]
};

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    fromUserId: 'teacher1',
    toUserId: 'parent1',
    content: 'Lucas a fait d\'excellents progrès cette semaine ! Je recommande particulièrement les histoires de Sophie pour développer sa curiosité scientifique.',
    timestamp: '2024-12-07T14:00:00Z',
    read: false,
    attachments: [
      {
        type: 'progress',
        data: {
          weeklyProgress: {
            storiesCompleted: 5,
            averageQuizScore: 85
          }
        }
      }
    ]
  },
  {
    id: 'msg2',
    fromUserId: 'parent1',
    toUserId: 'teacher1',
    content: 'Merci pour ces informations ! Lucas est très motivé par les badges, c\'est une excellente source de motivation.',
    timestamp: '2024-12-07T15:30:00Z',
    read: true
  }
];

export const mockReports: Report[] = [
  {
    id: 'report1',
    studentId: 'student1',
    teacherId: 'teacher1',
    type: 'weekly',
    period: {
      start: '2024-12-01T00:00:00Z',
      end: '2024-12-07T23:59:59Z'
    },
    metrics: {
      storiesCompleted: 8,
      quizzesTaken: 6,
      averageScore: 85,
      timeSpent: 180,
      newBadges: ['quiz_genius', 'dedicated_listener'],
      improvementAreas: [
        'Compréhension des métaphores',
        'Vocabulaire scientifique'
      ],
      strengths: [
        'Excellente mémoire auditive',
        'Fort engagement dans les quiz'
      ]
    },
    recommendations: [
      'Encourager la lecture des histoires de Sophie pour développer le vocabulaire scientifique',
      'Proposer des exercices de compréhension métaphorique avec les histoires de Max'
    ],
    generatedAt: '2024-12-07T23:00:00Z'
  }
];
