import { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick, onSearch }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="navbar-search">
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder="Search patients, records..."
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-actions">
        <span className="navbar-date">{currentDate}</span>
        <button className="navbar-icon-btn">
          <Bell size={18} />
        </button>
        <div className="navbar-avatar">DR</div>
      </div>
    </header>
  );
};

export default Navbar;
