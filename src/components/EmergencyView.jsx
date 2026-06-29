import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AlertTriangle, Phone, Activity, Heart, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';

const EmergencyView = () => {
  const { getPatient, currentPatientId, getPatientRecords } = useAppContext();
  const { id } = useParams();
  
  const patient = getPatient(id || currentPatientId);
  const records = getPatientRecords(id || currentPatientId);
  const latestRecord = records[0];

  if (!patient) return <div className="container mt-4"><h2>Patient not found</h2></div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-deep)', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '1.5rem', color: 'var(--danger)', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem'
        }}>
          <ArrowLeft size={18} /> Back to Portal
        </Link>

        <div className="card" style={{
          border: '2px solid var(--danger-border)',
          boxShadow: '0 0 40px rgba(248, 113, 113, 0.15)',
          background: 'var(--bg-card-solid)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--danger-border)', paddingBottom: '1rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1rem',
              background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--danger-border)', animation: 'pulse-dot 2s infinite'
            }}>
              <AlertTriangle size={32} style={{ color: 'var(--danger)' }} />
            </div>
            <h1 style={{ color: 'var(--danger)', fontSize: '1.75rem', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-heading)' }}>
              In Case of Emergency
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              SWASTHYA CHAIN MEDICAL ALERT
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Patient Identity */}
            <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.4rem 0' }}>{patient.name}</h2>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span>ID: {patient.id}</span>
                <span>{patient.age} Yrs</span>
                <span>{patient.gender}</span>
                {patient.currentState && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <MapPin size={12} /> {patient.currentState}
                  </span>
                )}
              </div>
            </div>

            {/* Critical Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{
                background: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--danger)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  <Heart size={16} /> BLOOD TYPE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{patient.bloodGroup}</div>
              </div>

              <div style={{
                background: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--danger)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '0.4rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                  <Activity size={16} /> ALLERGIES
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--danger)' }}>
                  {patient.allergies.join(', ') || 'None Known'}
                </div>
              </div>
            </div>

            {/* Chronic Conditions */}
            <div style={{
              background: 'var(--warning-bg)', padding: '1rem', borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--warning)'
            }}>
              <h3 style={{ margin: '0 0 0.4rem 0', color: 'var(--warning)', fontSize: '0.85rem', fontWeight: 'bold' }}>CHRONIC CONDITIONS</h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontWeight: 500, listStyle: 'disc' }}>
                {patient.chronicConditions.map(c => <li key={c}>{c}</li>)}
              </ul>
            </div>

            {/* Latest Treatment */}
            {latestRecord && (
              <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)', margin: '0 0 0.4rem 0' }}>LATEST TREATMENT</h3>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{latestRecord.diagnosis}</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{latestRecord.treatment}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <ShieldCheck size={12} style={{ color: 'var(--success)' }} />
                  <span className="font-mono text-muted">{latestRecord.hash}</span>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            <div style={{
              background: 'var(--gradient-primary)', color: 'white', padding: '1.5rem',
              borderRadius: 'var(--radius-md)', textAlign: 'center'
            }}>
              <Phone size={28} style={{ margin: '0 auto 0.5rem auto' }} />
              <h3 style={{ margin: '0 0 0.4rem 0', color: 'white' }}>EMERGENCY CONTACT</h3>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {patient.emergencyContact?.phone || '+91 98765 43210'}
              </div>
              <div style={{ opacity: 0.85, fontSize: '0.9rem' }}>
                {patient.emergencyContact?.relation} ({patient.emergencyContact?.name || 'Sunita Devi'})
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyView;
