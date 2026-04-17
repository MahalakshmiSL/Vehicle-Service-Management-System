import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/components', label: 'Components', icon: '⚙' },
  { to: '/vehicles', label: 'Vehicles', icon: '🚗' },
  { to: '/issues', label: 'Issues', icon: '🔧' },
  { to: '/payments', label: 'Invoices', icon: '📋' },
  { to: '/dashboard', label: 'Revenue', icon: '📊' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="brand-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#cc2200"/>
            <path d="M9 26 L13 14 L18 21 L23 11 L27 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="18" cy="18" r="3.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
         <div>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'white', letterSpacing: 3 }}>GARAGE</span>
                <span style={{ display: 'block', fontSize: 15, color: 'white', letterSpacing: 2, textTransform: 'uppercase' }}>Service Management</span>
              </div>
      </Link>

      <div className="navbar-links">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="navbar-right">
        <div className="nav-status">
          <span className="status-dot"></span>
          <span className="status-text">System Online</span>
        </div>
      </div>
    </nav>
  );
}
