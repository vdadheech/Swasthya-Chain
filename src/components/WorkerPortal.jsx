import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';
import { useAppContext, SECRET_KEY } from '../context/AppContext';
import AIInsights from './AIInsights';
import {
  ShieldCheck, Calendar, Activity, AlertCircle, MapPin, WifiOff,
  Share2, Download, ArrowRight, CheckCircle, Briefcase, Globe
} from 'lucide-react';

const WorkerPortal = () => {
  const { t, getPatient, getPatientRecords, currentPatientId, isOnline, addToast, simulateSMS, lang } = useAppContext();
  const patient = getPatient(currentPatientId);
  const records = getPatientRecords(currentPatientId);

  if (!patient) return <div className="container mt-4">Loading...</div>;

  const qrPayload = JSON.stringify({
    id: patient.id,
    name: patient.name,
    bg: patient.bloodGroup,
    al: patient.allergies,
    cc: patient.chronicConditions,
    hash: records[0]?.hash || 'no-records'
  });
  const encryptedQR = CryptoJS.AES.encrypt(qrPayload, SECRET_KEY).toString();

  const uniqueStates = new Set(patient.stateHistory?.map(s => s.state) || []);

  const handleShareSMS = () => {
    simulateSMS(currentPatientId, patient.smsLanguagePreference || lang);
    addToast(`Health ID shared via SMS in ${lang.toUpperCase()}`, 'success');
  };

  const handleDownloadCard = () => {
    addToast('Health Card PDF generated (simulated)', 'info');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      {!isOnline && (
        <div className="badge badge-warning" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center', fontSize: '0.8rem' }}>
          <WifiOff size={14} /> {t.offlineMode}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Left Col: ID Card + QR + Portability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Health ID Card */}
          <div className="card card-glow" style={{ textAlign: 'center' }}>
            {/* Portability Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-success">
                <ShieldCheck size={10} /> {t.verifiedAcross} {uniqueStates.size} {t.states}
              </span>
              <span className="badge badge-primary">
                {t.portableId}
              </span>
            </div>

            <div className="qr-container verified" style={{ margin: '0 auto 1.25rem' }}>
              <QRCodeSVG
                value={encryptedQR}
                size={160}
                level="H"
                fgColor="#111111"
              />
            </div>

            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>{t.healthId}: {patient.id}</span>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.15rem', marginTop: '0.5rem' }}>{patient.name}</h2>
            <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              {patient.age} Yrs • {patient.gender} • {patient.bloodGroup}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={14} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Allergies:</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--danger)' }}>{patient.allergies.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Conditions:</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{patient.chronicConditions.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Current:</span>
                <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>{patient.currentState}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={handleShareSMS} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <Share2 size={14} /> {t.shareViaSMS}
              </button>
              <button onClick={handleDownloadCard} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                <Download size={14} /> {t.downloadCard}
              </button>
            </div>
          </div>

          {/* Migration Timeline */}
          <div className="card">
            <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} style={{ color: 'var(--accent)' }} />
              {t.migrationHistory}
            </h3>
            <div className="timeline">
              {patient.stateHistory?.map((entry, i) => (
                <div key={i} className={`timeline-item ${entry.to === 'Present' ? 'pending' : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{entry.state}</h4>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>{entry.facility}</p>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.7rem', flexShrink: 0 }}>
                      {entry.from} — {entry.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Insights + Medical History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <AIInsights patient={patient} records={records} />

          {/* Records */}
          <div>
            <div className="flex-between mb-2">
              <h2 className="text-gradient" style={{ fontSize: '1.35rem' }}>{t.myRecords}</h2>
              <div className="badge badge-success" style={{ gap: '0.25rem' }}>
                <ShieldCheck size={12} /> {t.blockchainAnchor}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {records.length === 0 ? (
                <div className="card text-muted" style={{ textAlign: 'center', padding: '3rem' }}>
                  {t.noRecords}
                </div>
              ) : (
                records.map(record => (
                  <div key={record.recordId} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: 0, left: 0, width: '3px', height: '100%',
                      background: record.hash === 'pending_sync' ? 'var(--warning)' : 'var(--gradient-primary)'
                    }} />

                    <div className="flex-between mb-1">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} className="text-muted" />
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{new Date(record.date).toLocaleDateString()}</span>
                        {record.state && (
                          <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>{record.state}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {record.verified ? (
                          <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '0.6rem' }}>PENDING</span>
                        )}
                        <span className="font-mono text-muted">{record.hash}</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{record.diagnosis}</h3>
                    <p style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <strong>{t.treatment}:</strong> {record.treatment}
                    </p>

                    <div className="flex-between" style={{
                      fontSize: '0.8rem', color: 'var(--text-muted)',
                      paddingTop: '0.6rem', borderTop: '1px solid var(--glass-border)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} /> {record.clinic}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>{record.doctor}</span>
                        {record.cost && <span style={{ color: 'var(--warning)' }}>₹{record.cost}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerPortal;
