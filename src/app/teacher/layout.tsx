import TeacherSidebar from '@/components/teacher/TeacherSidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <TeacherSidebar />
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
