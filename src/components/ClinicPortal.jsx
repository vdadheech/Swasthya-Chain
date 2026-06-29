import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useAppContext, SECRET_KEY } from '../context/AppContext';
import {
  ScanLine, FilePlus, UserCircle, Activity, WifiOff, Mic, ShieldCheck,
  CheckCircle, Loader2, AlertCircle, MapPin, Calendar, Hash, BadgeCheck
} from 'lucide-react';
import AIInsights from './AIInsights';
import { processVoiceDictation } from '../services/AIService';

const ClinicPortal = () => {
  const { t, patients, getPatientRecords, addRecord, isOnline, verifyDoctor, addToast } = useAppContext();
  const [scannedPatient, setScannedPatient] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [cost, setCost] = useState('');
  const [clinicName, setClinicName] = useState('Govt Hospital, AP');
  const [doctorName, setDoctorName] = useState('Dr. Reddy');
  const [isListening, setIsListening] = useState(false);

  // Doctor verification
  const [doctorVerified, setDoctorVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  // Anchoring animation
  const [anchoring, setAnchoring] = useState(false);
  const [anchorSteps, setAnchorSteps] = useState([]);

  const handleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('Speech Recognition not supported in this browser', 'warning');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);

      const result = await processVoiceDictation(transcript);
      setDiagnosis(result.diagnosis);
      setTreatment(result.treatment);
      setCost(String(result.cost));
      addToast('Voice entry processed by AI', 'success');
    };

    recognition.onerror = () => { setIsListening(false); addToast('Voice recognition error', 'danger'); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleVerifyDoctor = async () => {
    setVerifying(true);
    try {
      const result = await verifyDoctor(doctorName, 'DOC-' + Date.now().toString().slice(-6));
      setVerificationData(result);
      setDoctorVerified(true);
      addToast(`${doctorName} verified on blockchain`, 'success');
    } catch {
      addToast('Verification failed', 'danger');
    }
    setVerifying(false);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockPatient = patients[0];
      const qrPayload = JSON.stringify({
        id: mockPatient.id,
        name: mockPatient.name,
        bg: mockPatient.bloodGroup,
        al: mockPatient.allergies,
        cc: mockPatient.chronicConditions,
        hash: 'latest-hash-anchor'
      });
      const simulatedScannedEncryptedStr = CryptoJS.AES.encrypt(qrPayload, SECRET_KEY).toString();

      try {
        const bytes = CryptoJS.AES.decrypt(simulatedScannedEncryptedStr, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setScannedPatient({
          id: decryptedData.id,
          name: decryptedData.name,
          age: mockPatient.age,
          gender: mockPatient.gender,
          bloodGroup: decryptedData.bg,
          allergies: decryptedData.al,
          chronicConditions: decryptedData.cc
        });
        addToast('QR decoded — patient data loaded', 'success');
      } catch {
        addToast('Invalid QR Code!', 'danger');
      }
      setIsScanning(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis || !treatment) return;

    setAnchoring(true);
    setAnchorSteps([]);

    // Simulate blockchain anchoring animation
    const steps = [
      'Doctor credentials verified ✓',
      'Record encrypted with AES-256 ✓',
      'Hash generated ✓',
      'Anchored to blockchain ✓'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnchorSteps(prev => [...prev, steps[i]]);
    }

    addRecord(scannedPatient.id, {
      diagnosis,
      treatment,
      clinic: clinicName,
      doctor: doctorName,
      doctorId: verificationData?.doctorId || 'DOC-unverified',
      state: 'Andhra Pradesh',
      cost: parseInt(cost) || 250,
      verified: doctorVerified
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    setAnchoring(false);
    setAnchorSteps([]);
    setDiagnosis('');
    setTreatment('');
    setCost('');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      {!isOnline && (
        <div className="badge badge-warning" style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center', fontSize: '0.8rem' }}>
          <WifiOff size={14} /> {t.offlineMode}
        </div>
      )}

      {/* Scanner Section */}
      <div className="card glass-panel" style={{ textAlign: 'center', padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Clinic Scanner</h2>
        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          Scan a worker's Swasthya Health ID QR code to access their immutable medical history.
        </p>
        <button
          onClick={handleSimulateScan}
          className="btn btn-primary btn-lg"
          disabled={isScanning}
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <ScanLine size={22} className={isScanning ? 'animate-pulse' : ''} />
          {isScanning ? 'Scanning...' : t.scanQR}
        </button>
      </div>

      {scannedPatient && (
        <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

          {/* Left: Patient Details + Add Record */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Patient Details */}
            <div className="card">
              <div className="flex-between mb-2">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <UserCircle size={18} style={{ color: 'var(--primary)' }} /> {t.patientDetails}
                </h3>
                <span className="badge badge-primary">{scannedPatient.id}</span>
              </div>
              <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <p><strong>Name:</strong> {scannedPatient.name}</p>
                <p><strong>Age/Gender:</strong> {scannedPatient.age} / {scannedPatient.gender}</p>
                <p><strong>Blood Group:</strong> {scannedPatient.bloodGroup}</p>
                <p style={{ color: 'var(--danger)' }}><strong>Allergies:</strong> {scannedPatient.allergies.join(', ')}</p>
                <p style={{ color: 'var(--warning)' }}><strong>Conditions:</strong> {scannedPatient.chronicConditions.join(', ')}</p>
              </div>
            </div>

            {/* Doctor Verification */}
            <div className="card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BadgeCheck size={18} style={{ color: 'var(--accent)' }} /> {t.doctorVerification}
              </h3>
              {doctorVerified ? (
                <div style={{
                  padding: '1rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--success-border)', display: 'flex', flexDirection: 'column', gap: '0.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--success)' }}>
                    <CheckCircle size={16} /> {doctorName} — {t.verified}
                  </div>
                  <div className="font-mono text-muted" style={{ fontSize: '0.7rem' }}>
                    Credential: {verificationData?.credential} | Hash: {verificationData?.hash}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleVerifyDoctor}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  disabled={verifying}
                >
                  {verifying ? (
                    <><Loader2 size={16} className="animate-spin" /> Verifying on blockchain...</>
                  ) : (
                    <><ShieldCheck size={16} /> {t.verifyCredentials} — {doctorName}</>
                  )}
                </button>
              )}
            </div>

            {/* Add Record Form */}
            <div className="card">
              <div className="flex-between mb-2">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                  <FilePlus size={18} style={{ color: 'var(--primary)' }} /> {t.addRecord}
                </h3>
                <button
                  type="button"
                  className={`btn ${isListening ? 'btn-primary animate-pulse' : 'btn-outline'} btn-sm`}
                  onClick={handleVoiceDictation}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <Mic size={14} /> {isListening ? 'Listening...' : 'Voice Entry'}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">{t.diagnosis}</label>
                  <input
                    type="text" className="input-field"
                    placeholder="e.g., Dengue Fever"
                    value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">{t.treatment}</label>
                  <textarea
                    className="input-field"
                    placeholder="Prescription and notes..."
                    value={treatment} onChange={(e) => setTreatment(e.target.value)}
                    rows="3" required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">{t.clinic}</label>
                    <input type="text" className="input-field" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.doctor}</label>
                    <input type="text" className="input-field" value={doctorName} onChange={(e) => { setDoctorName(e.target.value); setDoctorVerified(false); }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">{t.cost} (₹)</label>
                    <input type="number" className="input-field" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="250" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={anchoring}>
                  {anchoring ? (
                    <><Loader2 size={16} className="animate-spin" /> Anchoring...</>
                  ) : (
                    <><ShieldCheck size={16} /> {t.submitAnchor}</>
                  )}
                </button>
              </form>

              {/* Anchoring Animation */}
              {anchoring && anchorSteps.length > 0 && (
                <div style={{
                  marginTop: '1rem', padding: '0.75rem',
                  background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                  display: 'flex', flexDirection: 'column', gap: '0.4rem'
                }}>
                  {anchorSteps.map((step, i) => (
                    <div key={i} className="animate-fade-in" style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.8rem', color: 'var(--success)'
                    }}>
                      <CheckCircle size={12} /> {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: AI + Patient History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AIInsights patient={scannedPatient} records={getPatientRecords(scannedPatient.id)} />

            <div>
              <h3 className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <Activity size={16} style={{ color: 'var(--primary)' }} /> Patient History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {getPatientRecords(scannedPatient.id).map(record => (
                  <div key={record.recordId} className="card" style={{
                    padding: '1rem', borderLeft: '3px solid',
                    borderLeftColor: record.verified ? 'var(--primary)' : 'var(--warning)'
                  }}>
                    <div className="flex-between mb-1">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={12} className="text-muted" />
                        <strong style={{ fontSize: '0.85rem' }}>{new Date(record.date).toLocaleDateString()}</strong>
                        {record.state && <span className="badge badge-neutral" style={{ fontSize: '0.55rem' }}>{record.state}</span>}
                      </div>
                      <span className={`badge ${record.verified ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                        {record.verified ? <><CheckCircle size={8} /> Verified</> : 'Pending'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem' }}>{record.diagnosis}</h4>
                    <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0.35rem 0' }}>{record.treatment}</p>
                    <div className="font-mono text-muted" style={{
                      padding: '0.2rem 0.5rem', background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)', fontSize: '0.65rem',
                      display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem'
                    }}>
                      <Hash size={9} /> {record.hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicPortal;
