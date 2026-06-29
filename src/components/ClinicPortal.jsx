import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ScanLine, FilePlus, UserCircle, Activity } from 'lucide-react';

const ClinicPortal = () => {
  const { t, patients, getPatientRecords, addRecord } = useAppContext();
  const [scannedPatient, setScannedPatient] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [clinicName, setClinicName] = useState('Govt Hospital, AP');
  const [doctorName, setDoctorName] = useState('Dr. Reddy');

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate scanning the default patient QR
      setScannedPatient(patients[0]);
      setIsScanning(false);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!diagnosis || !treatment) return;

    addRecord(scannedPatient.id, {
      diagnosis,
      treatment,
      clinic: clinicName,
      doctor: doctorName
    });

    setDiagnosis('');
    setTreatment('');
    alert('Record securely anchored to blockchain!');
  };

  return (
    <div className="container animate-fade-in mt-4 mb-4">
      <div className="card glass-panel mb-4" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Clinic Scanner</h2>
        <p className="text-muted mb-2">Scan a worker's Swasthya Health ID QR code to access their immutable medical history.</p>
        
        <button 
          onClick={handleSimulateScan} 
          className="btn btn-primary"
          disabled={isScanning}
          style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: '50px' }}
        >
          <ScanLine size={24} className={isScanning ? 'animate-pulse' : ''} />
          {isScanning ? 'Scanning...' : t.scanQR}
        </button>
      </div>

      {scannedPatient && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Patient Details & Add Record */}
          <div>
            <div className="card mb-4">
              <div className="flex-between mb-2">
                <h3 className="flex-center gap-sm"><UserCircle className="text-primary" /> {t.patientDetails}</h3>
                <span className="badge badge-primary">{scannedPatient.id}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Name:</strong> {scannedPatient.name}</p>
                <p><strong>Age/Gender:</strong> {scannedPatient.age} / {scannedPatient.gender}</p>
                <p><strong>Blood Group:</strong> {scannedPatient.bloodGroup}</p>
                <p className="text-danger mt-1"><strong>Allergies:</strong> {scannedPatient.allergies.join(', ')}</p>
                <p className="text-warning"><strong>Conditions:</strong> {scannedPatient.chronicConditions.join(', ')}</p>
              </div>
            </div>

            <div className="card">
              <h3 className="flex-center gap-sm mb-2"><FilePlus className="text-primary" /> {t.addRecord}</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">{t.diagnosis}</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g., Dengue Fever"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">{t.treatment}</label>
                  <textarea 
                    className="input-field" 
                    placeholder="Prescription and notes..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">{t.clinic}</label>
                    <input type="text" className="input-field" value={clinicName} onChange={(e)=>setClinicName(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Doctor</label>
                    <input type="text" className="input-field" value={doctorName} onChange={(e)=>setDoctorName(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit & Anchor Record
                </button>
              </form>
            </div>
          </div>

          {/* Past Records View (Clinic Side) */}
          <div>
            <h3 className="mb-2 flex-center gap-sm" style={{ justifyContent: 'flex-start' }}>
              <Activity className="text-primary" /> Patient History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {getPatientRecords(scannedPatient.id).map(record => (
                <div key={record.recordId} className="card" style={{ padding: '1rem', borderLeft: '4px solid var(--secondary-color)' }}>
                  <div className="flex-between mb-1">
                    <strong>{new Date(record.date).toLocaleDateString()}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Verified</span>
                  </div>
                  <h4 style={{ color: 'var(--text-main)' }}>{record.diagnosis}</h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem', margin: '0.5rem 0' }}>{record.treatment}</p>
                  <div className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: '#f1f5f9', padding: '0.25rem', borderRadius: '4px', overflowX: 'hidden', textOverflow: 'ellipsis' }}>
                    TxHash: {record.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ClinicPortal;
