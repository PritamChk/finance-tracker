import React from 'react';
import SidebarNav from './SidebarNav';
import { useSidebar } from '../../hooks/useSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="layout">
      <SidebarNav />
      <main className={`layout-content ${isOpen ? 'layout-content-expanded' : 'layout-content-collapsed'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
