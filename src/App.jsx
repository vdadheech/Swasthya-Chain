import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Header from './components/Header';
import WorkerPortal from './components/WorkerPortal';
import ClinicPortal from './components/ClinicPortal';
import EmergencyView from './components/EmergencyView';
import PrivacyDashboard from './components/PrivacyDashboard';
import InsuranceClaims from './components/InsuranceClaims';
import BlockchainVisualizer from './components/BlockchainVisualizer';
import SMSSimulator from './components/SMSSimulator';
import SyncStatus from './components/SyncStatus';
import { ShieldCheck, Lock, Wifi, Globe, FileText, CheckCircle } from 'lucide-react';

function App() {
  const location = useLocation();
  const { toasts, records, claims, getPatient, currentPatientId } = useAppContext();
  const isEmergency = location.pathname.startsWith('/emergency');
  const patient = getPatient(currentPatientId);
  const uniqueStates = new Set(patient?.stateHistory?.map(s => s.state) || []);

  return (
    <>
      {!isEmergency && <Header />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<WorkerPortal />} />
          <Route path="/clinic" element={<ClinicPortal />} />
          <Route path="/emergency/:id?" element={<EmergencyView />} />
          <Route path="/privacy" element={<PrivacyDashboard />} />
          <Route path="/insurance" element={<InsuranceClaims />} />
          <Route path="/blockchain" element={<BlockchainVisualizer />} />
          <Route path="/sms" element={<SMSSimulator />} />
        </Routes>
      </main>

      {/* Floating Sync Status */}
      {!isEmergency && <SyncStatus />}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle size={16} style={{ color: 'var(--success)' }} />}
              {toast.type === 'warning' && <Wifi size={16} style={{ color: 'var(--warning)' }} />}
              {toast.type === 'danger' && <ShieldCheck size={16} style={{ color: 'var(--danger)' }} />}
              {toast.type === 'info' && <FileText size={16} style={{ color: 'var(--info)' }} />}
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {!isEmergency && (
        <footer className="app-footer">
          <div className="container footer-content">
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, marginBottom: '0.25rem' }}>
                Swasthya Chain
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                Blockchain-anchored Health ID • Built for Tech & AI for Social Good 2026
              </p>
            </div>
            <div className="footer-stats">
              <div className="footer-stat">
                <div className="footer-stat-value">{uniqueStates.size}</div>
                <div className="footer-stat-label">States</div>
              </div>
              <div className="footer-stat">
                <div className="footer-stat-value">{records.length}</div>
                <div className="footer-stat-label">Records</div>
              </div>
              <div className="footer-stat">
                <div className="footer-stat-value">{claims.filter(c => c.status === 'approved').length}</div>
                <div className="footer-stat-label">Claims</div>
              </div>
              <div className="footer-stat">
                <div className="footer-stat-value">
                  <Lock size={16} />
                </div>
                <div className="footer-stat-label">Zero Cloud</div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;
