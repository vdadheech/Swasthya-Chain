import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import CryptoJS from 'crypto-js';
import { useAppContext, SECRET_KEY } from '../context/AppContext';
import { generateSMSSummary } from '../services/AIService';
import { MessageSquare, Send, Globe, QrCode, Phone, CheckCircle } from 'lucide-react';

const SMSSimulator = () => {
  const { t, lang, getPatient, getPatientRecords, currentPatientId, simulateSMS, addToast } = useAppContext();
  const patient = getPatient(currentPatientId);
  const records = getPatientRecords(currentPatientId);
  const [smsLang, setSmsLang] = useState(lang);
  const [messages, setMessages] = useState([]);
  const [sent, setSent] = useState(false);

  const langLabels = { en: 'English', hi: 'हिंदी', ta: 'தமிழ்', bn: 'বাংলা' };

  const handleSendSMS = () => {
    const smsText = simulateSMS(currentPatientId, smsLang);
    const detailedSMS = generateSMSSummary(patient, records, smsLang);
    
    setMessages([
      {
        type: 'system',
        text: `SMS sent in ${langLabels[smsLang]} to ${patient.emergencyContact?.phone || '+91 XXXXX XXXXX'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        type: 'received',
        text: detailedSMS,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setSent(true);
    addToast(`Health summary SMS sent in ${langLabels[smsLang]}`, 'success');
  };

  // QR payload for emergency access
  const emergencyQRPayload = JSON.stringify({
    type: 'swasthya-emergency',
    id: patient?.id,
    name: patient?.name,
    bg: patient?.bloodGroup,
    al: patient?.allergies,
    ec: patient?.emergencyContact?.phone,
  });
  const encryptedEmergencyQR = CryptoJS.AES.encrypt(emergencyQRPayload, SECRET_KEY).toString();

  if (!patient) return null;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="section-title text-gradient">{t.smsSimulator}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Left: SMS Control + Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Language Select + Send */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
              {t.sendHealthSummary}
            </h3>

            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Send a blockchain-verified health summary via SMS in the worker's preferred language. No app installation needed.
            </p>

            <div className="input-group">
              <label className="input-label">SMS Language</label>
              <select
                className="input-field"
                value={smsLang}
                onChange={e => { setSmsLang(e.target.value); setSent(false); setMessages([]); }}
              >
                {Object.entries(langLabels).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Recipient</label>
              <div className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Phone size={14} />
                {patient.emergencyContact?.phone || '+91 XXXXX XXXXX'} ({patient.emergencyContact?.name})
              </div>
            </div>

            <button
              onClick={handleSendSMS}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Send size={16} />
              {sent ? 'Resend SMS' : t.sendHealthSummary}
            </button>

            {sent && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.75rem', padding: '0.5rem 0.75rem',
                background: 'var(--success-bg)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--success-border)', fontSize: '0.8rem', color: 'var(--success)'
              }}>
                <CheckCircle size={14} /> SMS delivered successfully
              </div>
            )}
          </div>

          {/* QR Access */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <QrCode size={18} style={{ color: 'var(--accent)' }} />
              {t.qrAccess}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
              Scan this QR for instant emergency access — no typing, no login, no app needed.
            </p>
            <div className="qr-container verified" style={{ margin: '0 auto' }}>
              <QRCodeSVG
                value={encryptedEmergencyQR}
                size={160}
                level="H"
                fgColor="#0f172a"
              />
            </div>
            <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.75rem' }}>
              Encrypted • AES-256 • Emergency data only
            </p>
          </div>
        </div>

        {/* Right: Phone Mockup */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div className="phone-frame animate-slide-up">
            <div className="phone-header">
              <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <MessageSquare size={14} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Swasthya Chain</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>VM-SWSTHY</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '0.75rem', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: messages.length > 0 ? 'flex-start' : 'center' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <MessageSquare size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
                  <p>Send an SMS to preview it here</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i}>
                    {msg.type === 'system' && (
                      <div style={{
                        textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)',
                        margin: '0.5rem 0', padding: '0.25rem 0.5rem',
                        background: 'rgba(148, 163, 184, 0.05)', borderRadius: 'var(--radius-full)'
                      }}>
                        {msg.text}
                      </div>
                    )}
                    {msg.type === 'received' && (
                      <div className="sms-bubble" style={{ animationDelay: `${i * 0.2}s` }}>
                        <pre style={{
                          fontFamily: 'var(--font-body)', fontSize: '0.8rem',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: 1.6
                        }}>
                          {msg.text}
                        </pre>
                        <div className="sms-time">{msg.time}</div>
                      </div>
                    )}
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

export default SMSSimulator;
