import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Globe, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { t, toggleLanguage, lang } = useAppContext();
  const location = useLocation();
  const isClinic = location.pathname === '/clinic';

  return (
    <header className="app-header">
      <div className="container header-content">
        <Link to="/" className="logo-area">
          <Activity size={28} />
          <span>{t.appTitle}</span>
        </Link>
        
        <div className="flex-center gap-md">
          <nav className="flex-center gap-sm">
            <Link 
              to="/" 
              className={`btn ${!isClinic ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {t.workerPortal}
            </Link>
            <Link 
              to="/clinic" 
              className={`btn ${isClinic ? 'btn-secondary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {t.clinicPortal}
            </Link>
          </nav>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>

          <button onClick={toggleLanguage} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }} title={t.switchLang}>
            <Globe size={18} />
            <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem', fontWeight: 'bold' }}>{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
