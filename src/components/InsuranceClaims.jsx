import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assessInsuranceEligibility } from '../services/AIService';
import {
  FileText, Shield, CheckCircle, Clock, ChevronRight, Plus, AlertCircle,
  IndianRupee, Calendar, User, MapPin, Hash, Loader2, X
} from 'lucide-react';

const InsuranceClaims = () => {
  const { t, getPatient, getPatientRecords, currentPatientId, claims, generateInsuranceClaim, submitClaim, records } = useAppContext();
  const patient = getPatient(currentPatientId);
  const patientRecords = getPatientRecords(currentPatientId);
  const patientClaims = claims.filter(c => c.patientId === currentPatientId);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [generatingClaim, setGeneratingClaim] = useState(false);

  if (!patient) return null;

  const policy = patient.insurancePolicies?.[0];

  const statusConfig = {
    draft: { color: 'var(--text-muted)', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', label: t.draft },
    submitted: { color: 'var(--info)', bg: 'var(--info-bg)', border: 'var(--info-border)', label: t.submitted },
    processing: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'var(--warning-border)', label: t.processing },
    approved: { color: 'var(--success)', bg: 'var(--success-bg)', border: 'var(--success-border)', label: t.approved },
    rejected: { color: 'var(--danger)', bg: 'var(--danger-bg)', border: 'var(--danger-border)', label: t.rejected },
  };

  const handleGenerate = async () => {
    if (!selectedRecordId || !policy) return;
    setGeneratingClaim(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    generateInsuranceClaim(selectedRecordId, policy.id);
    setGeneratingClaim(false);
    setShowGenerator(false);
    setSelectedRecordId('');
  };

  const handleSubmit = (claimId) => {
    submitClaim(claimId);
  };

  const selectedRecord = records.find(r => r.recordId === selectedRecordId);
  const eligibility = selectedRecord ? assessInsuranceEligibility(selectedRecord.diagnosis) : null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="section-title text-gradient">{t.insurance}</h1>

      {/* Policy Card */}
      {policy && (
        <div className="card animate-glow" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            <div className="flex-between mb-2">
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: 'var(--primary)' }} />
                {policy.scheme}
              </h3>
              <span className="badge badge-success">{policy.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.scheme}</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{policy.id}</p>
              </div>
              <div>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.validTill}</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{policy.validTill}</p>
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', background: 'var(--primary-surface)', borderRadius: 'var(--radius-md)'
          }}>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{t.coverageAmount}</span>
            <span style={{
              fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700,
              background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              ₹{(policy.coverageAmount / 100000).toFixed(0)}L
            </span>
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>₹{policy.coverageAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Claims List */}
        <div>
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: '1rem' }}>{t.claimHistory}</h3>
            <button onClick={() => setShowGenerator(true)} className="btn btn-primary btn-sm">
              <Plus size={14} /> {t.generateClaim}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {patientClaims.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                <p>No claims yet. Generate one from a medical record.</p>
              </div>
            ) : (
              patientClaims.map(claim => {
                const config = statusConfig[claim.status] || statusConfig.draft;
                return (
                  <div key={claim.claimId} className="card" style={{ padding: '1rem' }}>
                    <div className="flex-between mb-1">
                      <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{claim.claimId}</span>
                      <span className="badge" style={{
                        background: config.bg, color: config.color, border: `1px solid ${config.border}`
                      }}>
                        {claim.status === 'processing' && <Loader2 size={10} className="animate-spin" />}
                        {claim.status === 'approved' && <CheckCircle size={10} />}
                        {config.label}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', margin: '0.5rem 0 0.25rem' }}>{claim.diagnosis}</h4>

                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <IndianRupee size={12} /> ₹{claim.claimAmount}
                      </span>
                      {claim.submittedDate && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Calendar size={12} /> {claim.submittedDate}
                        </span>
                      )}
                    </div>

                    {/* Stepper */}
                    <div className="stepper" style={{ marginTop: '0.75rem' }}>
                      {['draft', 'submitted', 'processing', 'approved'].map((step, i) => {
                        const stepOrder = { draft: 0, submitted: 1, processing: 2, approved: 3 };
                        const currentOrder = stepOrder[claim.status] ?? 0;
                        const isCompleted = stepOrder[step] < currentOrder;
                        const isActive = step === claim.status;
                        return (
                          <div key={step} className={`stepper-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="stepper-circle">
                              {isCompleted ? <CheckCircle size={14} /> : i + 1}
                            </div>
                            <span className="stepper-label">{statusConfig[step]?.label || step}</span>
                          </div>
                        );
                      })}
                    </div>

                    {claim.status === 'draft' && (
                      <button
                        onClick={() => handleSubmit(claim.claimId)}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                      >
                        {t.submitClaim} <ChevronRight size={14} />
                      </button>
                    )}

                    {claim.txHash && (
                      <div className="font-mono text-muted" style={{
                        marginTop: '0.5rem', padding: '0.3rem 0.5rem',
                        background: 'rgba(148,163,184,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem',
                        display: 'flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <Hash size={10} /> TxHash: {claim.txHash}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Claim Details / Generator Preview */}
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <span className="stat-label">{t.claimsProcessed}</span>
              <span className="stat-value">{patientClaims.filter(c => c.status === 'approved').length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Claimed</span>
              <span className="stat-value" style={{ fontSize: '1.5rem' }}>
                ₹{patientClaims.filter(c => c.status === 'approved').reduce((s, c) => s + c.claimAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Card */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--info)' }} />
              How Auto-Claims Work
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { step: '1', text: 'Select a blockchain-verified medical record' },
                { step: '2', text: 'AI auto-fills diagnosis, treatment, and cost data' },
                { step: '3', text: 'PM-JAY eligibility is checked automatically' },
                { step: '4', text: 'Submit — the claim is anchored to blockchain for transparency' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-light)', flexShrink: 0
                  }}>
                    {item.step}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Generate Claim Modal */}
      {showGenerator && (
        <div className="modal-overlay" onClick={() => setShowGenerator(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex-between mb-3">
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} style={{ color: 'var(--primary)' }} /> {t.generateClaim}
              </h2>
              <button onClick={() => setShowGenerator(false)} className="btn btn-ghost btn-icon">
                <X size={18} />
              </button>
            </div>

            <div className="input-group">
              <label className="input-label">{t.selectRecord}</label>
              <select className="input-field" value={selectedRecordId} onChange={e => setSelectedRecordId(e.target.value)}>
                <option value="">-- {t.selectRecord} --</option>
                {patientRecords.filter(r => r.hash !== 'pending_sync').map(r => (
                  <option key={r.recordId} value={r.recordId}>
                    {r.date} — {r.diagnosis} (₹{r.cost || 500})
                  </option>
                ))}
              </select>
            </div>

            {selectedRecord && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex-between mb-1">
                    <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{t.autoFilled}</span>
                    {eligibility?.covered && <span className="badge badge-success">PM-JAY Eligible</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t.diagnosis}</span>
                      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{selectedRecord.diagnosis}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t.treatment}</span>
                      <p style={{ fontSize: '0.9rem' }}>{selectedRecord.treatment}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t.doctor}</span>
                      <p style={{ fontSize: '0.9rem' }}>{selectedRecord.doctor}</p>
                    </div>
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>{t.claimAmount}</span>
                      <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>₹{selectedRecord.cost || 500}</p>
                    </div>
                  </div>
                  <div className="font-mono text-muted" style={{
                    marginTop: '0.75rem', padding: '0.3rem 0.5rem',
                    background: 'rgba(148,163,184,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.65rem',
                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                  }}>
                    <Hash size={10} /> Blockchain Ref: {selectedRecord.hash}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={generatingClaim}
                >
                  {generatingClaim ? (
                    <><Loader2 size={16} className="animate-spin" /> Generating...</>
                  ) : (
                    <><FileText size={16} /> {t.generateClaim}</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceClaims;
