import React from 'react';
import SidebarNav from './SidebarNav';
import { useSidebar } from '../../hooks/useSidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="layout">
      <SidebarNav />
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={toggle}>
          {isOpen ? '✕' : '☰'}
        </button>
        <span className="mobile-logo">💰 FinanceTracker</span>
      </div>
      <main className={`layout-content ${isOpen ? 'layout-content-expanded' : 'layout-content-collapsed'}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
