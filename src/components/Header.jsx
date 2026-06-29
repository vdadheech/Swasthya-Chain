import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Globe, AlertTriangle, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { t, lang, setLanguage, syncQueue, isOnline } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: t.workerPortal },
    { path: '/clinic', label: t.clinicPortal },
    { path: '/privacy', label: t.privacy },
    { path: '/insurance', label: t.insurance },
    { path: '/blockchain', label: t.blockchain },
    { path: '/sms', label: 'SMS' },
  ];

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo-area">
          <div className="logo-icon">
            <Activity size={20} />
          </div>
          <span>{t.appTitle}</span>
        </Link>

        <nav className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Globe size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="hi">हिं</option>
              <option value="ta">தமி</option>
              <option value="bn">বাং</option>
            </select>
          </div>

          {/* Sync Badge */}
          {syncQueue.length > 0 && (
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              {syncQueue.length} pending
            </span>
          )}

          {/* ICE Button */}
          <Link
            to="/emergency"
            className="btn btn-danger btn-sm"
            style={{ fontWeight: 700, letterSpacing: '0.05em' }}
          >
            <AlertTriangle size={14} /> ICE
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
