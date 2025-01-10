import { useEffect, useState } from 'react';

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  teacherId: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    // Données temporaires en attendant l'implémentation de l'API
    setUser({
      id: '1',
      firstName: 'Dani',
      lastName: 'Dupont',
      teacherId: '1'
    });

    setTeacher({
      id: '1',
      firstName: 'Marie',
      lastName: 'Moinault',
      title: 'Mme'
    });

    // TODO: Implémenter la vraie logique API
    // const fetchUserData = async () => {
    //   try {
    //     const userData = await fetch('/api/user');
    //     const userJson = await userData.json();
    //     setUser(userJson);

    //     if (userJson.teacherId) {
    //       const teacherData = await fetch(`/api/teacher/${userJson.teacherId}`);
    //       const teacherJson = await teacherData.json();
    //       setTeacher(teacherJson);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // };

    // fetchUserData();
  }, []);

  return { user, teacher };
}
