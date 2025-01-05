'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassPerformance } from '@/components/teacher/performance/ClassPerformance';
import { StudentPerformance } from '@/components/teacher/performance/StudentPerformance';

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
        <TabsList className="mb-8">
          <TabsTrigger value="class">Performance de la classe</TabsTrigger>
          <TabsTrigger value="students">Performance par élève</TabsTrigger>
        </TabsList>
        
        <TabsContent value="class">
          <ClassPerformance />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentPerformance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
