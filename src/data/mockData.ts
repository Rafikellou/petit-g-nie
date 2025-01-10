// Mock data for development
export const mockTeacher = {
  id: '1',
  title: 'Mme',
  firstName: 'Marie',
  lastName: 'Dubois',
  email: 'marie.dubois@lasalle-rouen.fr',
  class: {
    id: '1',
    name: 'CE2-A',
    students: [
      {
        id: '1',
        firstName: 'Lucas',
        lastName: 'Martin',
        averageScore: 85,
        completedActivities: 24,
        lastActive: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 jours
      },
      {
        id: '2',
        firstName: 'Emma',
        lastName: 'Bernard',
        averageScore: 92,
        completedActivities: 28,
        lastActive: Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 jour
      }
    ]
  }
};
