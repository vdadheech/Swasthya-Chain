import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const SECRET_KEY = "swasthya-secret-2026";

// ============================================
// MOCK DATA — Rich demo dataset
// ============================================

const initialPatients = [
  {
    id: 'SC-8492-4911',
    name: 'Ramesh Kumar',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
    homeState: 'Bihar',
    currentState: 'Andhra Pradesh',
    stateHistory: [
      { state: 'Bihar', from: '1981', to: '2018', facility: 'PHC Darbhanga' },
      { state: 'Maharashtra', from: '2018', to: '2023', facility: 'Municipal Hospital, Pune' },
      { state: 'Andhra Pradesh', from: '2023', to: 'Present', facility: 'Govt Hospital, Vijayawada' }
    ],
    emergencyContact: { name: 'Sunita Devi', phone: '+91 98765 43210', relation: 'Wife' },
    insurancePolicies: [
      {
        id: 'PMJAY-BH-284729',
        scheme: 'Ayushman Bharat PM-JAY',
        coverageAmount: 500000,
        status: 'Active',
        validTill: '2027-03-31'
      }
    ],
    smsLanguagePreference: 'hi',
    doctorVerifications: [
      { doctorId: 'DOC-SH-001', name: 'Dr. Sharma', hash: '0x7e3f...a92d', date: '2026-05-12', facility: 'PHC Bihar' },
      { doctorId: 'DOC-RD-002', name: 'Dr. Reddy', hash: '0x1b4c...f83e', date: '2026-06-20', facility: 'Govt Hospital, AP' }
    ]
  }
];

const initialRecords = [
  {
    recordId: 'rec-001',
    patientId: 'SC-8492-4911',
    date: '2026-05-12',
    clinic: 'Primary Health Center, Bihar',
    state: 'Bihar',
    diagnosis: 'Seasonal Flu',
    treatment: 'Paracetamol 500mg, Rest, Fluids',
    doctor: 'Dr. Sharma',
    doctorId: 'DOC-SH-001',
    verified: true,
    hash: '0x8f2a...394e',
    cost: 250
  },
  {
    recordId: 'rec-002',
    patientId: 'SC-8492-4911',
    date: '2026-03-08',
    clinic: 'Municipal Hospital, Pune',
    state: 'Maharashtra',
    diagnosis: 'Hypertension Follow-up',
    treatment: 'Amlodipine 5mg daily, BP monitoring',
    doctor: 'Dr. Patil',
    doctorId: 'DOC-PT-003',
    verified: true,
    hash: '0x3d7b...e1f2',
    cost: 400
  },
  {
    recordId: 'rec-003',
    patientId: 'SC-8492-4911',
    date: '2025-11-22',
    clinic: 'PHC Darbhanga, Bihar',
    state: 'Bihar',
    diagnosis: 'Respiratory Infection',
    treatment: 'Azithromycin 500mg x 3 days, Steam inhalation',
    doctor: 'Dr. Sharma',
    doctorId: 'DOC-SH-001',
    verified: true,
    hash: '0xa9c1...7b3d',
    cost: 600
  },
  {
    recordId: 'rec-004',
    patientId: 'SC-8492-4911',
    date: '2025-06-15',
    clinic: 'Construction Site Medical Camp, Pune',
    state: 'Maharashtra',
    diagnosis: 'Heat Exhaustion',
    treatment: 'ORS, IV Fluids, Rest for 48 hours',
    doctor: 'Dr. Joshi',
    doctorId: 'DOC-JS-004',
    verified: true,
    hash: '0x5e8f...c4a1',
    cost: 350
  }
];

const initialClaims = [
  {
    claimId: 'CLM-2026-001',
    patientId: 'SC-8492-4911',
    recordId: 'rec-003',
    policyId: 'PMJAY-BH-284729',
    diagnosis: 'Respiratory Infection',
    claimAmount: 600,
    status: 'approved',
    submittedDate: '2025-11-25',
    processedDate: '2025-12-02',
    txHash: '0xf2e1...88a3'
  }
];

const initialAccessLog = [
  { timestamp: '2026-06-20T10:30:00', accessor: 'Dr. Reddy', action: 'Viewed records', facility: 'Govt Hospital, AP', txHash: '0x1b4c...f83e' },
  { timestamp: '2026-05-12T14:15:00', accessor: 'Dr. Sharma', action: 'Added record', facility: 'PHC Bihar', txHash: '0x8f2a...394e' },
  { timestamp: '2026-03-08T09:45:00', accessor: 'Dr. Patil', action: 'Added record', facility: 'Municipal Hospital, Pune', txHash: '0x3d7b...e1f2' },
  { timestamp: '2025-12-02T11:00:00', accessor: 'PM-JAY System', action: 'Insurance claim processed', facility: 'Auto', txHash: '0xf2e1...88a3' },
];

// ============================================
// TRANSLATIONS — EN / HI / TA / BN
// ============================================

const translations = {
  en: {
    appTitle: 'Swasthya Chain',
    workerPortal: 'Worker Portal',
    clinicPortal: 'Clinic Portal',
    privacy: 'Privacy',
    insurance: 'Insurance',
    blockchain: 'Blockchain',
    switchLang: 'Change Language',
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
    logout: 'Exit Portal',
    portableId: 'Portable Health ID',
    verifiedAcross: 'Verified across',
    states: 'states',
    migrationHistory: 'Migration Timeline',
    shareViaSMS: 'Share via SMS',
    downloadCard: 'Download Card',
    privacyScore: 'Privacy Score',
    encryptionActive: 'AES-256 Encryption Active',
    zeroCloud: 'Zero Cloud Storage',
    localOnly: 'All data stored locally on your device',
    accessLog: 'Data Access Log',
    syncStatus: 'Sync Status',
    online: 'Online',
    offline: 'Offline',
    pendingSync: 'Pending Sync',
    synced: 'Synced',
    doctorVerification: 'Doctor Verification',
    verifyCredentials: 'Verify Credentials',
    verified: 'Verified',
    chainIntegrity: 'Chain Integrity',
    generateClaim: 'Generate Claim',
    claimHistory: 'Claim History',
    claimStatus: 'Claim Status',
    smsPreview: 'SMS Preview',
    emergencyAccess: 'Emergency Access',
    offlineMode: 'Offline Mode — Records will sync when connection is restored',
    submitAnchor: 'Submit & Anchor Record',
    allRecordsSynced: 'All records synced',
    recordsPending: 'records pending sync',
    home: 'Home',
    statesMigrated: 'States',
    recordsSecured: 'Records Secured',
    claimsProcessed: 'Claims Processed',
    doctor: 'Doctor',
    cost: 'Cost',
    coverageAmount: 'Coverage',
    policyStatus: 'Policy Status',
    scheme: 'Scheme',
    validTill: 'Valid Till',
    claimAmount: 'Claim Amount',
    submitted: 'Submitted',
    processing: 'Processing',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft',
    selectRecord: 'Select a medical record',
    autoFilled: 'Auto-filled from blockchain record',
    submitClaim: 'Submit Claim',
    privacyDashboard: 'Privacy Dashboard',
    dataStoredLocally: 'Data stored locally',
    noCloudServers: 'No cloud servers',
    encryptedByDefault: 'Encrypted by default',
    blockchainVerified: 'Blockchain verified',
    allowEmergencyAccess: 'Allow Emergency Access',
    shareWithInsurance: 'Share with Insurance',
    storageBreakdown: 'Storage Breakdown',
    medicalRecords: 'Medical Records',
    personalInfo: 'Personal Info',
    insuranceData: 'Insurance Data',
    healthSummary: 'Health Summary',
    sendHealthSummary: 'Send Health Summary via SMS',
    smsSimulator: 'SMS Gateway',
    qrAccess: 'QR-Based Access (No Typing)',
    blockchainExplorer: 'Blockchain Explorer',
    totalBlocks: 'Total Blocks',
    lastVerified: 'Last Verified',
    integrity: 'Integrity',
    recordDetails: 'Record Details',
  },
  hi: {
    appTitle: 'स्वास्थ्य चेन',
    workerPortal: 'श्रमिक पोर्टल',
    clinicPortal: 'क्लिनिक पोर्टल',
    privacy: 'गोपनीयता',
    insurance: 'बीमा',
    blockchain: 'ब्लॉकचेन',
    switchLang: 'भाषा बदलें',
    healthId: 'स्वास्थ्य आईडी',
    scanQR: 'QR कोड स्कैन करें',
    myRecords: 'मेरे मेडिकल रिकॉर्ड',
    addRecord: 'नया रिकॉर्ड जोड़ें',
    noRecords: 'कोई रिकॉर्ड नहीं मिला।',
    patientDetails: 'मरीज का विवरण',
    recentVisits: 'हाल की यात्राएं',
    diagnosis: 'निदान',
    treatment: 'इलाज',
    clinic: 'क्लिनिक',
    date: 'तारीख',
    blockchainAnchor: 'ब्लॉकचेन पर सुरक्षित',
    logout: 'पोर्टल से बाहर निकलें',
    portableId: 'पोर्टेबल स्वास्थ्य आईडी',
    verifiedAcross: 'सत्यापित',
    states: 'राज्य',
    migrationHistory: 'प्रवास इतिहास',
    shareViaSMS: 'SMS से भेजें',
    downloadCard: 'कार्ड डाउनलोड करें',
    privacyScore: 'गोपनीयता स्कोर',
    encryptionActive: 'AES-256 एन्क्रिप्शन सक्रिय',
    zeroCloud: 'शून्य क्लाउड भंडारण',
    localOnly: 'सारा डेटा आपके डिवाइस पर',
    accessLog: 'डेटा एक्सेस लॉग',
    syncStatus: 'सिंक स्थिति',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    pendingSync: 'सिंक बाकी',
    synced: 'सिंक हो गया',
    doctorVerification: 'डॉक्टर सत्यापन',
    verifyCredentials: 'प्रमाणपत्र सत्यापित करें',
    verified: 'सत्यापित',
    chainIntegrity: 'चेन अखंडता',
    generateClaim: 'दावा बनाएं',
    claimHistory: 'दावा इतिहास',
    claimStatus: 'दावा स्थिति',
    smsPreview: 'SMS पूर्वावलोकन',
    emergencyAccess: 'आपातकालीन पहुंच',
    offlineMode: 'ऑफलाइन मोड — कनेक्शन बहाल होने पर रिकॉर्ड सिंक होंगे',
    submitAnchor: 'सबमिट और एंकर करें',
    allRecordsSynced: 'सभी रिकॉर्ड सिंक हो गए',
    recordsPending: 'रिकॉर्ड सिंक बाकी',
    home: 'होम',
    statesMigrated: 'राज्य',
    recordsSecured: 'रिकॉर्ड सुरक्षित',
    claimsProcessed: 'दावे संसाधित',
    doctor: 'डॉक्टर',
    cost: 'लागत',
    coverageAmount: 'कवरेज',
    policyStatus: 'पॉलिसी स्थिति',
    scheme: 'योजना',
    validTill: 'वैध तक',
    claimAmount: 'दावा राशि',
    submitted: 'जमा किया',
    processing: 'प्रोसेसिंग',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    draft: 'ड्राफ्ट',
    selectRecord: 'एक मेडिकल रिकॉर्ड चुनें',
    autoFilled: 'ब्लॉकचेन रिकॉर्ड से ऑटो-भरा गया',
    submitClaim: 'दावा जमा करें',
    privacyDashboard: 'गोपनीयता डैशबोर्ड',
    dataStoredLocally: 'डेटा स्थानीय रूप से संग्रहीत',
    noCloudServers: 'कोई क्लाउड सर्वर नहीं',
    encryptedByDefault: 'डिफ़ॉल्ट रूप से एन्क्रिप्टेड',
    blockchainVerified: 'ब्लॉकचेन सत्यापित',
    allowEmergencyAccess: 'आपातकालीन पहुंच की अनुमति दें',
    shareWithInsurance: 'बीमा के साथ साझा करें',
    storageBreakdown: 'भंडारण विवरण',
    medicalRecords: 'मेडिकल रिकॉर्ड',
    personalInfo: 'व्यक्तिगत जानकारी',
    insuranceData: 'बीमा डेटा',
    healthSummary: 'स्वास्थ्य सारांश',
    sendHealthSummary: 'SMS से स्वास्थ्य सारांश भेजें',
    smsSimulator: 'SMS गेटवे',
    qrAccess: 'QR-आधारित पहुंच (टाइपिंग नहीं)',
    blockchainExplorer: 'ब्लॉकचेन एक्सप्लोरर',
    totalBlocks: 'कुल ब्लॉक',
    lastVerified: 'अंतिम सत्यापन',
    integrity: 'अखंडता',
    recordDetails: 'रिकॉर्ड विवरण',
  },
  ta: {
    appTitle: 'சுவாஸ்தியா செயின்',
    workerPortal: 'தொழிலாளர் போர்டல்',
    clinicPortal: 'மருத்துவமனை போர்டல்',
    privacy: 'தனியுரிமை',
    insurance: 'காப்பீடு',
    blockchain: 'பிளாக்செயின்',
    switchLang: 'மொழி மாற்றம்',
    healthId: 'சுகாதார அடையாளம்',
    scanQR: 'QR குறியீடு ஸ்கேன்',
    myRecords: 'எனது மருத்துவ பதிவுகள்',
    addRecord: 'புதிய பதிவு சேர்க்க',
    noRecords: 'பதிவுகள் இல்லை.',
    patientDetails: 'நோயாளி விவரங்கள்',
    recentVisits: 'சமீபத்திய வருகைகள்',
    diagnosis: 'நோய் கண்டறிதல்',
    treatment: 'சிகிச்சை',
    clinic: 'மருத்துவமனை',
    date: 'தேதி',
    blockchainAnchor: 'பிளாக்செயினில் பாதுகாப்பு',
    logout: 'வெளியேறு',
    portableId: 'கையடக்க சுகாதார அடையாளம்',
    verifiedAcross: 'சரிபார்க்கப்பட்டது',
    states: 'மாநிலங்கள்',
    migrationHistory: 'இடம்பெயர்வு வரலாறு',
    shareViaSMS: 'SMS வழியாக பகிர்',
    downloadCard: 'அட்டை பதிவிறக்கம்',
    privacyScore: 'தனியுரிமை மதிப்பெண்',
    encryptionActive: 'AES-256 குறியாக்கம் செயலில்',
    zeroCloud: 'கிளவுட் இல்லை',
    localOnly: 'உங்கள் சாதனத்தில் மட்டுமே',
    accessLog: 'அணுகல் பதிவு',
    syncStatus: 'ஒத்திசைவு நிலை',
    online: 'ஆன்லைன்',
    offline: 'ஆஃப்லைன்',
    pendingSync: 'ஒத்திசைவு நிலுவை',
    synced: 'ஒத்திசைக்கப்பட்டது',
    doctorVerification: 'மருத்துவர் சரிபார்ப்பு',
    verifyCredentials: 'சான்றுகளை சரிபார்க்கவும்',
    verified: 'சரிபார்க்கப்பட்டது',
    chainIntegrity: 'செயின் ஒருமைப்பாடு',
    generateClaim: 'கோரிக்கை உருவாக்கு',
    claimHistory: 'கோரிக்கை வரலாறு',
    claimStatus: 'கோரிக்கை நிலை',
    smsPreview: 'SMS முன்னோட்டம்',
    emergencyAccess: 'அவசர அணுகல்',
    offlineMode: 'ஆஃப்லைன் பயன்முறை — இணைப்பு மீட்டெடுக்கப்படும்போது பதிவுகள் ஒத்திசைக்கப்படும்',
    submitAnchor: 'சமர்ப்பித்து நங்கூரமிடு',
    allRecordsSynced: 'அனைத்து பதிவுகளும் ஒத்திசைக்கப்பட்டன',
    recordsPending: 'பதிவுகள் ஒத்திசைவு நிலுவையில்',
    home: 'முகப்பு',
    statesMigrated: 'மாநிலங்கள்',
    recordsSecured: 'பதிவுகள் பாதுகாப்பு',
    claimsProcessed: 'கோரிக்கைகள் செயலாக்கம்',
    doctor: 'மருத்துவர்',
    cost: 'செலவு',
    coverageAmount: 'கவரேஜ்',
    policyStatus: 'பாலிசி நிலை',
    scheme: 'திட்டம்',
    validTill: 'செல்லுபடி',
    claimAmount: 'கோரிக்கை தொகை',
    submitted: 'சமர்ப்பிக்கப்பட்டது',
    processing: 'செயலாக்கத்தில்',
    approved: 'ஒப்புதல்',
    rejected: 'நிராகரிக்கப்பட்டது',
    draft: 'வரைவு',
    selectRecord: 'ஒரு பதிவைத் தேர்ந்தெடுக்கவும்',
    autoFilled: 'பிளாக்செயின் பதிவிலிருந்து தானாக நிரப்பப்பட்டது',
    submitClaim: 'கோரிக்கையை சமர்ப்பிக்கவும்',
    privacyDashboard: 'தனியுரிமை டாஷ்போர்ட்',
    dataStoredLocally: 'தரவு உள்ளூரில் சேமிக்கப்பட்டது',
    noCloudServers: 'கிளவுட் சர்வர்கள் இல்லை',
    encryptedByDefault: 'இயல்பாகவே குறியாக்கம்',
    blockchainVerified: 'பிளாக்செயின் சரிபார்க்கப்பட்டது',
    allowEmergencyAccess: 'அவசர அணுகலை அனுமதி',
    shareWithInsurance: 'காப்பீட்டுடன் பகிர்',
    storageBreakdown: 'சேமிப்பு விவரம்',
    medicalRecords: 'மருத்துவ பதிவுகள்',
    personalInfo: 'தனிப்பட்ட தகவல்',
    insuranceData: 'காப்பீடு தரவு',
    healthSummary: 'சுகாதார சுருக்கம்',
    sendHealthSummary: 'SMS வழியாக சுகாதார சுருக்கம் அனுப்பவும்',
    smsSimulator: 'SMS கேட்வே',
    qrAccess: 'QR-அடிப்படை அணுகல்',
    blockchainExplorer: 'பிளாக்செயின் எக்ஸ்ப்ளோரர்',
    totalBlocks: 'மொத்த பிளாக்குகள்',
    lastVerified: 'கடைசி சரிபார்ப்பு',
    integrity: 'ஒருமைப்பாடு',
    recordDetails: 'பதிவு விவரங்கள்',
  },
  bn: {
    appTitle: 'স্বাস্থ্য চেইন',
    workerPortal: 'শ্রমিক পোর্টাল',
    clinicPortal: 'ক্লিনিক পোর্টাল',
    privacy: 'গোপনীয়তা',
    insurance: 'বীমা',
    blockchain: 'ব্লকচেইন',
    switchLang: 'ভাষা পরিবর্তন',
    healthId: 'স্বাস্থ্য আইডি',
    scanQR: 'QR কোড স্ক্যান করুন',
    myRecords: 'আমার মেডিকেল রেকর্ড',
    addRecord: 'নতুন রেকর্ড যোগ করুন',
    noRecords: 'কোনো রেকর্ড পাওয়া যায়নি।',
    patientDetails: 'রোগীর বিবরণ',
    recentVisits: 'সাম্প্রতিক ভিজিট',
    diagnosis: 'রোগ নির্ণয়',
    treatment: 'চিকিৎসা',
    clinic: 'ক্লিনিক',
    date: 'তারিখ',
    blockchainAnchor: 'ব্লকচেইনে সুরক্ষিত',
    logout: 'পোর্টাল থেকে বের হন',
    portableId: 'পোর্টেবল স্বাস্থ্য আইডি',
    verifiedAcross: 'যাচাইকৃত',
    states: 'রাজ্য',
    migrationHistory: 'স্থানান্তর ইতিহাস',
    shareViaSMS: 'SMS এ পাঠান',
    downloadCard: 'কার্ড ডাউনলোড',
    privacyScore: 'গোপনীয়তা স্কোর',
    encryptionActive: 'AES-256 এনক্রিপশন সক্রিয়',
    zeroCloud: 'শূন্য ক্লাউড স্টোরেজ',
    localOnly: 'সমস্ত ডেটা আপনার ডিভাইসে',
    accessLog: 'ডেটা অ্যাক্সেস লগ',
    syncStatus: 'সিঙ্ক অবস্থা',
    online: 'অনলাইন',
    offline: 'অফলাইন',
    pendingSync: 'সিঙ্ক অপেক্ষায়',
    synced: 'সিঙ্ক সম্পন্ন',
    doctorVerification: 'ডাক্তার যাচাই',
    verifyCredentials: 'শংসাপত্র যাচাই করুন',
    verified: 'যাচাইকৃত',
    chainIntegrity: 'চেইন অখণ্ডতা',
    generateClaim: 'দাবি তৈরি করুন',
    claimHistory: 'দাবির ইতিহাস',
    claimStatus: 'দাবির অবস্থা',
    smsPreview: 'SMS প্রিভিউ',
    emergencyAccess: 'জরুরি অ্যাক্সেস',
    offlineMode: 'অফলাইন মোড — সংযোগ পুনরুদ্ধার হলে রেকর্ড সিঙ্ক হবে',
    submitAnchor: 'জমা দিন ও অ্যাঙ্কর করুন',
    allRecordsSynced: 'সমস্ত রেকর্ড সিঙ্ক হয়েছে',
    recordsPending: 'রেকর্ড সিঙ্ক অপেক্ষায়',
    home: 'হোম',
    statesMigrated: 'রাজ্য',
    recordsSecured: 'রেকর্ড সুরক্ষিত',
    claimsProcessed: 'দাবি প্রক্রিয়াকৃত',
    doctor: 'ডাক্তার',
    cost: 'খরচ',
    coverageAmount: 'কভারেজ',
    policyStatus: 'পলিসি অবস্থা',
    scheme: 'স্কিম',
    validTill: 'বৈধ পর্যন্ত',
    claimAmount: 'দাবির পরিমাণ',
    submitted: 'জমা দেওয়া হয়েছে',
    processing: 'প্রক্রিয়াকরণ',
    approved: 'অনুমোদিত',
    rejected: 'প্রত্যাখ্যাত',
    draft: 'খসড়া',
    selectRecord: 'একটি মেডিকেল রেকর্ড নির্বাচন করুন',
    autoFilled: 'ব্লকচেইন রেকর্ড থেকে স্বয়ংক্রিয়ভাবে পূরণ',
    submitClaim: 'দাবি জমা দিন',
    privacyDashboard: 'গোপনীয়তা ড্যাশবোর্ড',
    dataStoredLocally: 'ডেটা স্থানীয়ভাবে সংরক্ষিত',
    noCloudServers: 'কোনো ক্লাউড সার্ভার নেই',
    encryptedByDefault: 'ডিফল্টভাবে এনক্রিপ্টেড',
    blockchainVerified: 'ব্লকচেইন যাচাইকৃত',
    allowEmergencyAccess: 'জরুরি অ্যাক্সেস অনুমতি দিন',
    shareWithInsurance: 'বীমার সাথে শেয়ার করুন',
    storageBreakdown: 'স্টোরেজ বিবরণ',
    medicalRecords: 'মেডিকেল রেকর্ড',
    personalInfo: 'ব্যক্তিগত তথ্য',
    insuranceData: 'বীমা ডেটা',
    healthSummary: 'স্বাস্থ্য সারসংক্ষেপ',
    sendHealthSummary: 'SMS এ স্বাস্থ্য সারসংক্ষেপ পাঠান',
    smsSimulator: 'SMS গেটওয়ে',
    qrAccess: 'QR-ভিত্তিক অ্যাক্সেস',
    blockchainExplorer: 'ব্লকচেইন এক্সপ্লোরার',
    totalBlocks: 'মোট ব্লক',
    lastVerified: 'সর্বশেষ যাচাই',
    integrity: 'অখণ্ডতা',
    recordDetails: 'রেকর্ড বিবরণ',
  }
};

// ============================================
// PROVIDER
// ============================================

export const AppProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('swasthya_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('swasthya_records');
    return saved ? JSON.parse(saved) : initialRecords;
  });
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('swasthya_claims');
    return saved ? JSON.parse(saved) : initialClaims;
  });
  const [accessLog, setAccessLog] = useState(() => {
    const saved = localStorage.getItem('swasthya_accessLog');
    return saved ? JSON.parse(saved) : initialAccessLog;
  });
  const [syncQueue, setSyncQueue] = useState(() => {
    const saved = localStorage.getItem('swasthya_syncQueue');
    return saved ? JSON.parse(saved) : [];
  });
  const [toasts, setToasts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lang, setLang] = useState('en');
  const [currentPatientId, setCurrentPatientId] = useState('SC-8492-4911');

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    allowEmergencyAccess: true,
    shareWithInsurance: true,
  });

  const t = translations[lang];

  // ---- Persistence ----
  useEffect(() => { localStorage.setItem('swasthya_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('swasthya_records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('swasthya_claims', JSON.stringify(claims)); }, [claims]);
  useEffect(() => { localStorage.setItem('swasthya_accessLog', JSON.stringify(accessLog)); }, [accessLog]);
  useEffect(() => { localStorage.setItem('swasthya_syncQueue', JSON.stringify(syncQueue)); }, [syncQueue]);

  // ---- Online/Offline Sync ----
  useEffect(() => {
    const syncPendingRecords = () => {
      setSyncQueue(prevQueue => {
        if (prevQueue.length === 0) return prevQueue;
        const syncedRecords = prevQueue.map(r => ({
          ...r,
          hash: '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6),
          verified: true
        }));
        setRecords(prev => [...syncedRecords, ...prev]);
        addToast(`${syncedRecords.length} offline records synced to blockchain!`, 'success');
        return [];
      });
    };

    const handleOnline = () => {
      setIsOnline(true);
      addToast('Connection restored', 'success');
      syncPendingRecords();
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast('You are offline — records saved locally', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine && syncQueue.length > 0) {
      syncPendingRecords();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ---- Toast System ----
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // ---- Language ----
  const setLanguage = (newLang) => {
    setLang(newLang);
  };

  // ---- Patient CRUD ----
  const getPatient = (id) => patients.find(p => p.id === id);

  const getPatientRecords = (id) => {
    const allRecords = [...syncQueue, ...records];
    return allRecords.filter(r => r.patientId === id).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const addRecord = (patientId, newRecord) => {
    const recordId = 'rec-' + Date.now();
    const date = new Date().toISOString().split('T')[0];
    
    if (isOnline) {
      const hash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      const record = { ...newRecord, recordId, patientId, date, hash, verified: true };
      setRecords(prev => [record, ...prev]);
      addAccessLog(newRecord.doctor || 'Doctor', 'Added record', newRecord.clinic || 'Clinic', hash);
      addToast('Record anchored to blockchain!', 'success');
      return record;
    } else {
      const record = { ...newRecord, recordId, patientId, date, hash: 'pending_sync', verified: false };
      setSyncQueue(prev => [record, ...prev]);
      addToast('Record saved offline — will sync when online', 'warning');
      return record;
    }
  };

  // ---- Access Log ----
  const addAccessLog = (accessor, action, facility, txHash) => {
    setAccessLog(prev => [{
      timestamp: new Date().toISOString(),
      accessor,
      action,
      facility,
      txHash
    }, ...prev]);
  };

  // ---- Doctor Verification ----
  const verifyDoctor = async (doctorName, doctorId) => {
    // Simulated blockchain verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    const hash = '0x' + CryptoJS.SHA256(doctorId + Date.now()).toString().slice(0, 8) + '...' + CryptoJS.SHA256(doctorName).toString().slice(0, 4);
    return {
      verified: true,
      doctorId,
      name: doctorName,
      hash,
      date: new Date().toISOString().split('T')[0],
      credential: 'MCI-' + Math.random().toString().slice(2, 8)
    };
  };

  // ---- Insurance Claims ----
  const generateInsuranceClaim = (recordId, policyId) => {
    const record = records.find(r => r.recordId === recordId);
    const patient = patients.find(p => p.id === record?.patientId);
    const policy = patient?.insurancePolicies?.find(p => p.id === policyId);
    
    if (!record || !patient || !policy) return null;

    const claim = {
      claimId: 'CLM-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-3),
      patientId: patient.id,
      recordId: record.recordId,
      policyId: policy.id,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      doctor: record.doctor,
      clinic: record.clinic,
      claimAmount: record.cost || 500,
      status: 'draft',
      submittedDate: null,
      processedDate: null,
      txHash: null
    };

    setClaims(prev => [claim, ...prev]);
    addToast('Insurance claim draft generated!', 'info');
    return claim;
  };

  const submitClaim = (claimId) => {
    setClaims(prev => prev.map(c => {
      if (c.claimId === claimId) {
        const txHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
        addToast('Claim submitted for processing!', 'success');
        // Simulate auto-processing after a delay
        setTimeout(() => {
          setClaims(prev2 => prev2.map(c2 =>
            c2.claimId === claimId ? { ...c2, status: 'approved', processedDate: new Date().toISOString().split('T')[0] } : c2
          ));
          addToast('Claim approved by PM-JAY!', 'success');
        }, 3000);
        return { ...c, status: 'processing', submittedDate: new Date().toISOString().split('T')[0], txHash };
      }
      return c;
    }));
  };

  // ---- SMS Simulation ----
  const simulateSMS = (patientId, targetLang) => {
    const patient = getPatient(patientId);
    const recs = getPatientRecords(patientId);
    const latestRecord = recs[0];
    const useLang = targetLang || lang;
    
    const smsSummaries = {
      en: `SWASTHYA CHAIN\nHealth ID: ${patient.id}\nName: ${patient.name}\nBlood: ${patient.bloodGroup}\nAllergies: ${patient.allergies.join(', ')}\n${latestRecord ? `Last Visit: ${latestRecord.diagnosis} (${latestRecord.date})` : ''}\nVerified ✓`,
      hi: `स्वास्थ्य चेन\nस्वास्थ्य ID: ${patient.id}\nनाम: ${patient.name}\nरक्त: ${patient.bloodGroup}\nएलर्जी: ${patient.allergies.join(', ')}\n${latestRecord ? `अंतिम जांच: ${latestRecord.diagnosis} (${latestRecord.date})` : ''}\nसत्यापित ✓`,
      ta: `சுவாஸ்தியா செயின்\nசுகாதார ID: ${patient.id}\nபெயர்: ${patient.name}\nரத்தம்: ${patient.bloodGroup}\nஒவ்வாமை: ${patient.allergies.join(', ')}\n${latestRecord ? `கடைசி வருகை: ${latestRecord.diagnosis} (${latestRecord.date})` : ''}\nசரிபார்க்கப்பட்டது ✓`,
      bn: `স্বাস্থ্য চেইন\nস্বাস্থ্য ID: ${patient.id}\nনাম: ${patient.name}\nরক্ত: ${patient.bloodGroup}\nঅ্যালার্জি: ${patient.allergies.join(', ')}\n${latestRecord ? `শেষ পরিদর্শন: ${latestRecord.diagnosis} (${latestRecord.date})` : ''}\nযাচাইকৃত ✓`
    };

    return smsSummaries[useLang] || smsSummaries.en;
  };

  return (
    <AppContext.Provider value={{
      lang,
      t,
      setLanguage,
      patients,
      currentPatientId,
      setCurrentPatientId,
      getPatient,
      getPatientRecords,
      addRecord,
      records,
      isOnline,
      syncQueue,
      claims,
      setClaims,
      generateInsuranceClaim,
      submitClaim,
      accessLog,
      addAccessLog,
      verifyDoctor,
      simulateSMS,
      privacySettings,
      setPrivacySettings,
      toasts,
      addToast
    }}>
      {children}
    </AppContext.Provider>
  );
};
