import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Calendar, Activity, AlertCircle, MapPin } from 'lucide-react';

const WorkerPortal = () => {
  const { t, getPatient, getPatientRecords, currentPatientId } = useAppContext();
  const patient = getPatient(currentPatientId);
  const records = getPatientRecords(currentPatientId);

  if (!patient) return <div>Loading...</div>;

  return (
    <div className="container animate-fade-in mt-4 mb-4">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Left Col: ID Card & QR */}
        <div>
          <div className="card glass-panel" style={{ textAlign: 'center', background: 'linear-gradient(to bottom, #ffffff, #f1f5f9)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>{t.healthId}: {patient.id}</span>
            </div>
            
            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '1.5rem' }}>
              <QRCodeSVG 
                value={JSON.stringify({ id: patient.id, hash: 'latest-hash-anchor' })} 
                size={180}
                level="H"
                fgColor="#0f172a"
              />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{patient.name}</h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>{patient.age} Yrs • {patient.gender} • Blood: {patient.bloodGroup}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} className="text-muted" />
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Allergies:</span>
                <span style={{ fontWeight: 500 }}>{patient.allergies.join(', ') || 'None'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} className="text-muted" />
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Conditions:</span>
                <span style={{ fontWeight: 500 }}>{patient.chronicConditions.join(', ') || 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Medical History Timeline */}
        <div>
          <div className="flex-between mb-2">
            <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>{t.myRecords}</h2>
            <div className="badge badge-success" style={{ gap: '0.25rem' }}>
              <ShieldCheck size={14} /> {t.blockchainAnchor}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.length === 0 ? (
              <div className="card text-muted" style={{ textAlign: 'center', padding: '3rem' }}>
                {t.noRecords}
              </div>
            ) : (
              records.map(record => (
                <div key={record.recordId} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                  
                  <div className="flex-between mb-1">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} className="text-muted" />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date(record.date).toLocaleDateString()}</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>Tx: {record.hash}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{record.diagnosis}</h3>
                  
                  <p style={{ marginBottom: '1rem', color: '#334155' }}>
                    <strong>{t.treatment}:</strong> {record.treatment}
                  </p>

                  <div className="flex-between" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} /> {record.clinic}
                    </div>
                    <div>{record.doctor}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default WorkerPortal;
