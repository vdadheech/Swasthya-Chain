import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link2, CheckCircle, ShieldCheck, Calendar, User, MapPin, Hash, ChevronRight, X } from 'lucide-react';

const BlockchainVisualizer = () => {
  const { t, records, currentPatientId, getPatient } = useAppContext();
  const patient = getPatient(currentPatientId);
  const patientRecords = records.filter(r => r.patientId === currentPatientId);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Genesis block + patient records
  const blocks = [
    {
      type: 'genesis',
      hash: '0x0000...0001',
      prevHash: '0x0000...0000',
      timestamp: '2025-01-01',
      data: { label: 'Genesis Block', detail: 'Swasthya Chain initialized' }
    },
    {
      type: 'identity',
      hash: '0x' + (patient?.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) + '...ID',
      prevHash: '0x0000...0001',
      timestamp: '2025-01-15',
      data: { label: 'Health ID Created', detail: `Patient: ${patient?.name}`, patientId: patient?.id }
    },
    ...patientRecords.map((r, i) => ({
      type: 'record',
      hash: r.hash,
      prevHash: i === 0 ? '0x' + (patient?.id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) + '...ID' : patientRecords[i - 1]?.hash,
      timestamp: r.date,
      verified: r.verified,
      data: {
        label: r.diagnosis,
        detail: r.treatment,
        doctor: r.doctor,
        clinic: r.clinic,
        state: r.state,
        cost: r.cost,
        recordId: r.recordId
      }
    }))
  ];

  const totalVerified = patientRecords.filter(r => r.verified).length;
  const integrityPercent = patientRecords.length > 0 ? Math.round((totalVerified / patientRecords.length) * 100) : 100;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="section-title text-gradient">{t.blockchainExplorer}</h1>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-label">{t.totalBlocks}</span>
          <span className="stat-value">{blocks.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t.lastVerified}</span>
          <span className="stat-value" style={{ fontSize: '1.25rem' }}>{patientRecords[0]?.date || 'N/A'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">{t.integrity}</span>
          <span className="stat-value">{integrityPercent}%</span>
          <div className="progress-bar" style={{ marginTop: '0.25rem' }}>
            <div className="progress-bar-fill" style={{ width: `${integrityPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Chain Visualization */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link2 size={16} style={{ color: 'var(--primary)' }} /> {t.chainIntegrity}
        </h3>

        <div className="chain-container">
          {blocks.map((block, i) => (
            <React.Fragment key={i}>
              <div
                className={`chain-block ${block.verified !== false ? 'verified' : ''}`}
                onClick={() => setSelectedBlock(block)}
                style={{
                  borderColor: block.type === 'genesis' ? 'rgba(99, 102, 241, 0.3)' :
                               block.type === 'identity' ? 'rgba(20, 184, 166, 0.3)' :
                               block.verified !== false ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.3)'
                }}
              >
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className={`badge ${
                    block.type === 'genesis' ? 'badge-info' :
                    block.type === 'identity' ? 'badge-primary' :
                    block.verified !== false ? 'badge-success' : 'badge-warning'
                  }`} style={{ fontSize: '0.6rem' }}>
                    {block.type === 'genesis' ? 'GENESIS' :
                     block.type === 'identity' ? 'IDENTITY' :
                     block.verified !== false ? 'VERIFIED' : 'PENDING'}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>#{i}</span>
                </div>

                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {block.data.label}
                </h4>

                <div className="font-mono" style={{ color: 'var(--primary)', marginBottom: '0.35rem', fontSize: '0.7rem' }}>
                  {block.hash}
                </div>

                <div className="flex-between" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Calendar size={10} /> {block.timestamp}
                  </span>
                  {block.verified !== false && block.type === 'record' && (
                    <CheckCircle size={12} style={{ color: 'var(--success)' }} />
                  )}
                </div>
              </div>

              {i < blocks.length - 1 && (
                <div className="chain-link">
                  <ChevronRight size={20} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="modal-overlay" onClick={() => setSelectedBlock(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-3">
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
                {t.recordDetails}
              </h2>
              <button onClick={() => setSelectedBlock(null)} className="btn btn-ghost btn-icon">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{selectedBlock.data.label}</h4>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedBlock.data.detail}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Hash size={12} /> Block Hash
                  </span>
                  <span className="font-mono" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{selectedBlock.hash}</span>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Hash size={12} /> Previous Hash
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.85rem' }}>{selectedBlock.prevHash}</span>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> Timestamp
                  </span>
                  <span style={{ fontSize: '0.85rem' }}>{selectedBlock.timestamp}</span>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={12} /> Status
                  </span>
                  <span className={`badge ${selectedBlock.verified !== false ? 'badge-success' : 'badge-warning'}`} style={{ marginTop: '0.15rem' }}>
                    {selectedBlock.verified !== false ? t.verified : t.pendingSync}
                  </span>
                </div>
              </div>

              {selectedBlock.data.doctor && (
                <div style={{ padding: '0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <User size={14} className="text-muted" /> {selectedBlock.data.doctor}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                    <MapPin size={14} className="text-muted" /> {selectedBlock.data.clinic}
                  </div>
                  {selectedBlock.data.cost && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--warning)' }}>₹{selectedBlock.data.cost}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockchainVisualizer;
