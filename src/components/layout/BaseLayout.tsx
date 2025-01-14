import { Background } from './Background';
import { Footer } from './Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function BaseLayout({ children, showFooter = true }: BaseLayoutProps) {
  return (
    <>
      <main className="min-h-screen safe-area-inset pt-24 bg-[#0A0A0B]">
        <Background />
        {children}
      </main>
      {showFooter && <Footer />}
    </>
  );
}
