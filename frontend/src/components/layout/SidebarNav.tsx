import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuthStore } from '../../stores/auth.store';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/categories', label: 'Categories', icon: '📁' },
];

const SidebarNav: React.FC = () => {
  const { isOpen, toggle, close } = useSidebar();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <>
      {isOpen && window.innerWidth < 768 && (
        <div className="sidebar-overlay" onClick={close} />
      )}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">💰 FinanceTracker</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => window.innerWidth < 768 && close()}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-btn" onClick={toggle} title={isOpen ? 'Collapse' : 'Expand'}>
            {isOpen ? '◀' : '▶'}
          </button>
          <button className="sidebar-btn sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarNav;
