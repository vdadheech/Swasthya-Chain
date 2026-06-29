import React, { useEffect, useState } from 'react';
import { generateHealthInsights } from '../services/AIService';
import { BrainCircuit, Loader2, AlertCircle, CheckCircle, Info, Lightbulb } from 'lucide-react';

const AIInsights = ({ patient, records }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    generateHealthInsights(patient, records).then(data => {
      if (isMounted) {
        setInsights(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [patient, records]);

  if (loading) {
    return (
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="animate-spin" style={{
          width: 28, height: 28, borderRadius: '50%',
          border: '3px solid var(--glass-border)',
          borderTopColor: 'var(--primary)',
        }} />
        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Local AI Analyzing...</span>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>Processing health patterns offline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{
      background: 'var(--gradient-card)',
      border: '1px solid var(--glass-border)'
    }}>
      <h3 style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '1rem', fontSize: '1rem'
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 'var(--radius-sm)',
          background: 'var(--primary-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <BrainCircuit size={16} style={{ color: 'var(--primary-light)' }} />
        </div>
        AI Health Insights
        <span className="badge badge-primary" style={{ fontSize: '0.55rem', marginLeft: 'auto' }}>LOCAL AI</span>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {insights.map((insight, index) => {
          let Icon = Info;
          let color = 'var(--info)';
          let bg = 'var(--info-bg)';
          let borderColor = 'var(--info-border)';

          if (insight.type === 'warning') {
            Icon = AlertCircle;
            color = 'var(--warning)';
            bg = 'var(--warning-bg)';
            borderColor = 'var(--warning-border)';
          } else if (insight.type === 'danger') {
            Icon = AlertCircle;
            color = 'var(--danger)';
            bg = 'var(--danger-bg)';
            borderColor = 'var(--danger-border)';
          } else if (insight.type === 'success') {
            Icon = CheckCircle;
            color = 'var(--success)';
            bg = 'var(--success-bg)';
            borderColor = 'var(--success-border)';
          }

          return (
            <div key={index} className="animate-fade-in" style={{
              display: 'flex',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: bg,
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-md)',
              alignItems: 'flex-start',
              animationDelay: `${index * 0.15}s`
            }}>
              <Icon size={16} style={{ color, flexShrink: 0, marginTop: '2px' }} />
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {insight.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
