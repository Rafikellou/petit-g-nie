import TeacherSidebar from '@/components/teacher/TeacherSidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950">
      <TeacherSidebar />
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
