'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassPerformance } from '@/components/teacher/performance/ClassPerformance';
import { StudentPerformance } from '@/components/teacher/performance/StudentPerformance';
import { Users, User } from 'lucide-react';

export default function PerformancePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Performances
        </h1>
        <p className="text-gray-400">
          Suivez les performances de votre classe et de vos élèves
        </p>
      </div>

      <Tabs defaultValue="class" className="w-full">
        <TabsList className="mb-8 p-1 bg-gray-900 border border-gray-800 rounded-lg">
          <TabsTrigger 
            value="class"
            className="flex items-center gap-2 data-[state=active]:bg-gray-800"
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Performance de la classe</span>
            <span className="sm:hidden">Classe</span>
          </TabsTrigger>
          <TabsTrigger 
            value="students"
            className="flex items-center gap-2 data-[state=active]:bg-gray-800"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Performance par élève</span>
            <span className="sm:hidden">Élèves</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="class" className="mt-0">
          <ClassPerformance />
        </TabsContent>
        
        <TabsContent value="students" className="mt-0">
          <StudentPerformance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
