import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, Users, UserPlus, BarChart3,
  Brain, Sun, Moon, Activity
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/add-patient', label: 'Add Record', icon: UserPlus },
  { path: '/predictions', label: 'Predictions', icon: Brain },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-icon">
            <Activity size={22} />
          </div>
          <div className="sidebar-logo-text">
            Health<span>Predict</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={toggleTheme}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
