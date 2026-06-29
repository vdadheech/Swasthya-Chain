import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Mock Data
const initialPatients = [
  {
    id: 'SC-8492-4911',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
  }
];

const initialRecords = [
  {
    recordId: 'rec-001',
    patientId: 'SC-8492-4911',
    date: '2026-05-12',
    clinic: 'Primary Health Center, Bihar',
    diagnosis: 'Seasonal Flu',
    treatment: 'Paracetamol, Rest',
    doctor: 'Dr. Sharma',
    hash: '0x8f2a...394e' // Simulated blockchain hash
  }
];

// Translations
const translations = {
  en: {
    appTitle: 'Swasthya Chain',
    workerPortal: 'Worker Portal',
    clinicPortal: 'Clinic Portal',
    switchLang: 'हिंदी में देखें',
    healthId: 'Health ID',
    scanQR: 'Scan QR Code',
    myRecords: 'My Medical Records',
    addRecord: 'Add New Record',
    noRecords: 'No records found.',
    patientDetails: 'Patient Details',
    recentVisits: 'Recent Visits',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    clinic: 'Clinic',
    date: 'Date',
    blockchainAnchor: 'Secured on Blockchain',
    logout: 'Exit Portal'
  },
  hi: {
    appTitle: 'स्वास्थ्य चेन',
    workerPortal: 'श्रमिक पोर्टल',
    clinicPortal: 'क्लिनिक पोर्टल',
    switchLang: 'View in English',
    healthId: 'स्वास्थ्य आईडी',
    scanQR: 'QR कोड स्कैन करें',
    myRecords: 'मेरे मेडिकल रिकॉर्ड',
    addRecord: 'नया रिकॉर्ड जोड़ें',
    noRecords: 'कोई रिकॉर्ड नहीं मिला।',
    patientDetails: 'मरीज का विवरण',
    recentVisits: 'हाल की यात्राएं',
    diagnosis: 'निदान (बीमारी)',
    treatment: 'इलाज',
    clinic: 'क्लिनिक',
    date: 'तारीख',
    blockchainAnchor: 'ब्लॉकचेन पर सुरक्षित',
    logout: 'पोर्टल से बाहर निकलें'
  }
};

export const AppProvider = ({ children }) => {
  const [patients, setPatients] = useState(initialPatients);
  const [records, setRecords] = useState(initialRecords);
  const [lang, setLang] = useState('en');
  const [currentPatientId, setCurrentPatientId] = useState('SC-8492-4911'); // Default for demo

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const getPatient = (id) => patients.find(p => p.id === id);
  const getPatientRecords = (id) => records.filter(r => r.patientId === id).sort((a, b) => new Date(b.date) - new Date(a.date));

  const addRecord = (patientId, newRecord) => {
    const hash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
    const record = {
      ...newRecord,
      recordId: 'rec-' + Date.now(),
      patientId,
      date: new Date().toISOString().split('T')[0],
      hash
    };
    setRecords([record, ...records]);
    return record;
  };

  return (
    <AppContext.Provider value={{
      lang,
      t,
      toggleLanguage,
      patients,
      currentPatientId,
      setCurrentPatientId,
      getPatient,
      getPatientRecords,
      addRecord
    }}>
      {children}
    </AppContext.Provider>
  );
};
