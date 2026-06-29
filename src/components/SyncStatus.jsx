import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wifi, WifiOff, RefreshCw, ChevronUp, ChevronDown, Clock, CheckCircle, Loader2 } from 'lucide-react';

const SyncStatus = () => {
  const { t, isOnline, syncQueue } = useAppContext();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="sync-float">
      {expanded && syncQueue.length > 0 && (
        <div className="sync-panel animate-slide-up">
          <div className="flex-between mb-2">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.pendingSync}</h4>
            <span className="badge badge-warning">{syncQueue.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {syncQueue.map((record, i) => (
              <div key={record.recordId || i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-input)',
                border: '1px solid var(--glass-border)'
              }}>
                <Loader2 size={14} className="animate-spin" style={{ color: 'var(--warning)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.diagnosis}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {record.date} • {record.clinic}
                  </div>
                </div>
                <Clock size={12} className="text-muted" />
              </div>
            ))}
          </div>
          {!isOnline && (
            <p className="text-muted" style={{ fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>
              {t.offlineMode}
            </p>
          )}
        </div>
      )}

      <button
        className="sync-indicator"
        onClick={() => setExpanded(!expanded)}
        style={{
          borderColor: isOnline ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
        }}
      >
        <span className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
        <span style={{ color: isOnline ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
          {isOnline ? t.online : t.offline}
        </span>

        {syncQueue.length > 0 && (
          <>
            <span style={{ color: 'var(--glass-border)' }}>•</span>
            <span style={{ color: 'var(--warning)' }}>
              {syncQueue.length} {t.pendingSync}
            </span>
          </>
        )}

        {syncQueue.length === 0 && isOnline && (
          <>
            <span style={{ color: 'var(--glass-border)' }}>•</span>
            <CheckCircle size={12} style={{ color: 'var(--success)' }} />
          </>
        )}

        {syncQueue.length > 0 && (
          expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />
        )}
      </button>
    </div>
  );
};

export default SyncStatus;
