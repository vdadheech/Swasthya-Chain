// ============================================
// SWASTHYA CHAIN — Local AI Service
// In production: WebLLM / Transformers.js / Ollama
// For prototype: Rule-based simulation with realistic logic
// ============================================

/**
 * Generate health insights from patient data and records.
 * Simulates local AI pattern detection.
 */
export const generateHealthInsights = async (patient, records) => {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const insights = [];

  if (!records || records.length === 0) {
    return [{ type: 'info', message: 'No medical history available for AI analysis.' }];
  }

  // Rule 1: Respiratory pattern detection
  const respiratoryIssues = records.filter(r =>
    /flu|cough|respiratory|asthma|bronchitis|pneumonia/i.test(r.diagnosis)
  );
  if (respiratoryIssues.length >= 2) {
    insights.push({
      type: 'warning',
      message: `Pattern detected: ${respiratoryIssues.length} respiratory-related visits. Possible environmental exposure at construction/industrial work site. Recommend pulmonary function test.`
    });
  }

  // Rule 2: Drug allergy cross-check
  if (patient.allergies?.includes('Penicillin')) {
    const dangerousPrescription = records.some(r =>
      /penicillin|amoxicillin|ampicillin/i.test(r.treatment)
    );
    if (dangerousPrescription) {
      insights.push({
        type: 'danger',
        message: 'CRITICAL: Patient allergic to Penicillin — a past record contains a related prescription (Amoxicillin/Ampicillin family). Flag for immediate review.'
      });
    }
  }

  // Rule 3: Hypertension monitoring gap
  if (patient.chronicConditions?.includes('Hypertension')) {
    const bpVisits = records.filter(r =>
      /hypertension|bp|blood pressure/i.test(r.diagnosis)
    );
    const lastBPVisit = bpVisits[0];
    if (lastBPVisit) {
      const daysSince = Math.floor((Date.now() - new Date(lastBPVisit.date)) / (1000 * 60 * 60 * 24));
      if (daysSince > 90) {
        insights.push({
          type: 'warning',
          message: `Hypertension follow-up overdue: Last BP check was ${daysSince} days ago. Guidelines recommend monitoring every 30-60 days for migrant workers with irregular diet and high physical strain.`
        });
      }
    }
  }

  // Rule 4: Heat-related illness pattern (migrant worker specific)
  const heatIssues = records.filter(r =>
    /heat|dehydration|sunstroke|exhaustion/i.test(r.diagnosis)
  );
  if (heatIssues.length >= 1) {
    insights.push({
      type: 'info',
      message: `Occupational health note: Patient has ${heatIssues.length} heat-related episode(s). Recommend employer-mandated hydration breaks and shade access during summer months.`
    });
  }

  // Rule 5: Cross-state treatment continuity
  if (patient.stateHistory?.length > 1) {
    const stateSet = new Set(records.map(r => r.state).filter(Boolean));
    if (stateSet.size > 1) {
      insights.push({
        type: 'success',
        message: `Portable health ID active: Medical records verified across ${stateSet.size} states (${[...stateSet].join(', ')}). Treatment continuity maintained through blockchain anchoring.`
      });
    }
  }

  // Rule 6: Insurance coverage suggestion
  const uncoveredRecords = records.filter(r => r.cost && r.cost > 300);
  if (uncoveredRecords.length > 0 && patient.insurancePolicies?.length > 0) {
    insights.push({
      type: 'info',
      message: `${uncoveredRecords.length} record(s) with costs above ₹300 detected. These may be eligible for PM-JAY reimbursement. Use the Insurance tab to auto-generate claims.`
    });
  }

  // Default positive
  if (insights.length === 0) {
    insights.push({
      type: 'success',
      message: 'AI Analysis complete. No chronic patterns, drug interactions, or missed follow-ups detected. Health profile looks stable.'
    });
  }

  return insights;
};

/**
 * Process voice dictation to extract diagnosis and treatment.
 * Simulates NLP extraction that would be done by local LLM.
 */
export const processVoiceDictation = async (transcript) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const lower = transcript.toLowerCase();
  let diagnosis = '';
  let treatment = '';
  let cost = 0;

  if (lower.includes('dengue') || lower.includes('fever')) {
    diagnosis = 'Fever / Possible Dengue';
    treatment = 'Paracetamol 500mg, Hydration, Platelet count monitoring';
    cost = 800;
  } else if (lower.includes('cough') || lower.includes('cold') || lower.includes('flu')) {
    diagnosis = 'Viral URI (Common Cold)';
    treatment = 'Dextromethorphan syrup 10ml BD, Steam inhalation, Vitamin C';
    cost = 300;
  } else if (lower.includes('injury') || lower.includes('fracture') || lower.includes('wound')) {
    diagnosis = 'Workplace Injury — Laceration/Contusion';
    treatment = 'Wound cleaning, Tetanus booster, Analgesics, Follow-up in 3 days';
    cost = 500;
  } else if (lower.includes('stomach') || lower.includes('diarr') || lower.includes('vomit')) {
    diagnosis = 'Acute Gastroenteritis';
    treatment = 'ORS, Ondansetron 4mg PRN, Bland diet, Hydration';
    cost = 350;
  } else {
    diagnosis = 'General Consultation';
    treatment = 'Prescribed symptomatic relief as dictated.';
    cost = 250;
  }

  return { diagnosis, treatment, cost };
};

/**
 * Generate insurance claim data from a medical record.
 */
export const generateClaimData = (record, patient, policy) => {
  if (!record || !patient || !policy) return null;

  return {
    patientName: patient.name,
    patientId: patient.id,
    policyNumber: policy.id,
    scheme: policy.scheme,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    treatingDoctor: record.doctor,
    facility: record.clinic,
    dateOfService: record.date,
    claimAmount: record.cost || 500,
    blockchainRef: record.hash,
    verified: record.verified,
    eligibility: assessInsuranceEligibility(record.diagnosis)
  };
};

/**
 * Check if a diagnosis is covered under PM-JAY / Ayushman Bharat.
 */
export const assessInsuranceEligibility = (diagnosis) => {
  const coveredConditions = [
    'flu', 'fever', 'dengue', 'malaria', 'respiratory', 'infection',
    'hypertension', 'diabetes', 'fracture', 'injury', 'gastro',
    'diarrhea', 'pneumonia', 'bronchitis', 'heat', 'dehydration',
    'exhaustion', 'wound', 'consultation'
  ];

  const lower = (diagnosis || '').toLowerCase();
  const isCovered = coveredConditions.some(c => lower.includes(c));

  return {
    covered: isCovered,
    category: isCovered ? 'Secondary Care' : 'Review Required',
    confidence: isCovered ? 0.92 : 0.45
  };
};

/**
 * Generate a concise health summary for SMS delivery.
 */
export const generateSMSSummary = (patient, records, lang = 'en') => {
  const latest = records[0];
  
  const templates = {
    en: `SWASTHYA CHAIN ALERT\nID: ${patient.id}\n${patient.name} | ${patient.bloodGroup}\nAllergy: ${patient.allergies.join(',') || 'None'}\n${latest ? `Last: ${latest.diagnosis}` : 'No recent visit'}\nEmergency: ${patient.emergencyContact?.phone || 'N/A'}\nBlockchain Verified ✓`,
    hi: `स्वास्थ्य चेन\nID: ${patient.id}\n${patient.name} | ${patient.bloodGroup}\nएलर्जी: ${patient.allergies.join(',') || 'कोई नहीं'}\n${latest ? `अंतिम: ${latest.diagnosis}` : 'हाल में कोई जांच नहीं'}\nआपातकालीन: ${patient.emergencyContact?.phone || 'N/A'}\nब्लॉकचेन सत्यापित ✓`,
    ta: `சுவாஸ்தியா\nID: ${patient.id}\n${patient.name} | ${patient.bloodGroup}\nஒவ்வாமை: ${patient.allergies.join(',') || 'இல்லை'}\n${latest ? `கடைசி: ${latest.diagnosis}` : 'சமீபத்தில் இல்லை'}\nஅவசரம்: ${patient.emergencyContact?.phone || 'N/A'}\nசரிபார்க்கப்பட்டது ✓`,
    bn: `স্বাস্থ্য চেইন\nID: ${patient.id}\n${patient.name} | ${patient.bloodGroup}\nঅ্যালার্জি: ${patient.allergies.join(',') || 'নেই'}\n${latest ? `শেষ: ${latest.diagnosis}` : 'সাম্প্রতিক নেই'}\nজরুরি: ${patient.emergencyContact?.phone || 'N/A'}\nযাচাইকৃত ✓`
  };

  return templates[lang] || templates.en;
};

/**
 * Detect potential drug interactions from treatment history.
 */
export const detectDrugInteractions = (records, allergies) => {
  const interactions = [];
  
  const dangerousCombos = [
    { drugs: ['amlodipine', 'atenolol'], risk: 'Excessive blood pressure lowering — monitor closely' },
    { drugs: ['paracetamol', 'ibuprofen'], risk: 'Increased risk of liver/kidney toxicity with prolonged use' },
    { drugs: ['azithromycin', 'amoxicillin'], risk: 'Concurrent macrolide + penicillin — unusual combo, verify intent' },
  ];

  const allTreatments = records.map(r => r.treatment.toLowerCase()).join(' ');

  dangerousCombos.forEach(combo => {
    if (combo.drugs.every(drug => allTreatments.includes(drug))) {
      interactions.push({
        type: 'warning',
        drugs: combo.drugs,
        message: combo.risk
      });
    }
  });

  // Check allergies against prescriptions
  if (allergies?.length > 0) {
    const penicillinFamily = ['penicillin', 'amoxicillin', 'ampicillin', 'flucloxacillin'];
    allergies.forEach(allergy => {
      const allergyLower = allergy.toLowerCase();
      if (allergyLower === 'penicillin') {
        penicillinFamily.forEach(drug => {
          if (allTreatments.includes(drug)) {
            interactions.push({
              type: 'danger',
              drugs: [drug],
              message: `ALLERGIC REACTION RISK: ${drug} prescribed despite ${allergy} allergy!`
            });
          }
        });
      }
    });
  }

  return interactions;
};
