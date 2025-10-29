import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SplashCursor from '../SplashCursor';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <SplashCursor />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;

