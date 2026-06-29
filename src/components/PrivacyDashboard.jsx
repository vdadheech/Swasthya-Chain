import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, Lock, Eye, HardDrive, CloudOff, CheckCircle, ToggleLeft, ToggleRight, FileText, Clock, Hash } from 'lucide-react';

const PrivacyDashboard = () => {
  const { t, accessLog, privacySettings, setPrivacySettings, records, currentPatientId, getPatient } = useAppContext();
  const patient = getPatient(currentPatientId);
  const [showFullLog, setShowFullLog] = useState(false);

  const privacyScore = 95; // Based on local storage + encryption + no cloud
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (privacyScore / 100) * circumference;

  const features = [
    { icon: Lock, label: t.encryptionActive, desc: 'AES-256 with per-session keys', active: true },
    { icon: CloudOff, label: t.zeroCloud, desc: t.noCloudServers, active: true },
    { icon: HardDrive, label: t.dataStoredLocally, desc: 'localStorage + IndexedDB', active: true },
    { icon: CheckCircle, label: t.blockchainVerified, desc: 'Immutable audit trail', active: true },
  ];

  // Simulated storage breakdown
  const storageItems = [
    { label: t.medicalRecords, size: '2.4 KB', percent: 48, color: 'var(--primary)' },
    { label: t.personalInfo, size: '0.8 KB', percent: 16, color: 'var(--accent)' },
    { label: t.insuranceData, size: '1.1 KB', percent: 22, color: 'var(--warning)' },
    { label: 'Encryption Keys', size: '0.7 KB', percent: 14, color: 'var(--success)' },
  ];

  const visibleLog = showFullLog ? accessLog : accessLog.slice(0, 4);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="section-title text-gradient">{t.privacyDashboard}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Privacy Score Gauge */}
        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="circular-gauge" style={{ width: 140, height: 140 }}>
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="gauge-text" style={{ fontSize: '2rem' }}>{privacyScore}%</span>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>{t.privacyScore}</h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Maximum privacy achieved</p>
          </div>

          {/* Toggle Controls */}
          <div style={{ width: '100%', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="flex-between" style={{ padding: '0.5rem 0', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.85rem' }}>{t.allowEmergencyAccess}</span>
              <button
                onClick={() => setPrivacySettings(p => ({ ...p, allowEmergencyAccess: !p.allowEmergencyAccess }))}
                className="btn-ghost"
                style={{ color: privacySettings.allowEmergencyAccess ? 'var(--success)' : 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {privacySettings.allowEmergencyAccess ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
            <div className="flex-between" style={{ padding: '0.5rem 0', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '0.85rem' }}>{t.shareWithInsurance}</span>
              <button
                onClick={() => setPrivacySettings(p => ({ ...p, shareWithInsurance: !p.shareWithInsurance }))}
                className="btn-ghost"
                style={{ color: privacySettings.shareWithInsurance ? 'var(--success)' : 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {privacySettings.shareWithInsurance ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Features + Storage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Security Features Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <f.icon size={18} style={{ color: 'var(--primary-light)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', marginBottom: '0.15rem' }}>{f.label}</h4>
                  <p className="text-muted" style={{ fontSize: '0.75rem' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Storage Breakdown */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={18} style={{ color: 'var(--primary)' }} /> {t.storageBreakdown}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {storageItems.map((item, i) => (
                <div key={i}>
                  <div className="flex-between" style={{ marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.size}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${item.percent}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.75rem', textAlign: 'center' }}>
              Total: 5.0 KB local storage — {t.noCloudServers}
            </p>
          </div>
        </div>
      </div>

      {/* Access Log */}
      <div className="card">
        <div className="flex-between mb-2">
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={18} style={{ color: 'var(--accent)' }} /> {t.accessLog}
          </h3>
          <span className="badge badge-neutral">{accessLog.length} entries</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {visibleLog.map((entry, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-input)',
              border: '1px solid var(--glass-border)'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: entry.action.includes('Added') ? 'var(--success-bg)' : entry.action.includes('Insurance') ? 'var(--warning-bg)' : 'var(--info-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {entry.action.includes('Added') ? <FileText size={14} style={{ color: 'var(--success)' }} /> :
                 entry.action.includes('Insurance') ? <Shield size={14} style={{ color: 'var(--warning)' }} /> :
                 <Eye size={14} style={{ color: 'var(--info)' }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{entry.accessor} — {entry.action}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{entry.facility}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="text-muted" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={10} /> {new Date(entry.timestamp).toLocaleDateString()}
                </div>
                <div className="font-mono text-muted" style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Hash size={10} /> {entry.txHash}
                </div>
              </div>
            </div>
          ))}
        </div>

        {accessLog.length > 4 && (
          <button
            onClick={() => setShowFullLog(!showFullLog)}
            className="btn btn-ghost"
            style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.8rem' }}
          >
            {showFullLog ? 'Show Less' : `Show All ${accessLog.length} Entries`}
          </button>
        )}
      </div>
    </div>
  );
};

export default PrivacyDashboard;
