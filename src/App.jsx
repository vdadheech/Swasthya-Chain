import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import WorkerPortal from './components/WorkerPortal';
import ClinicPortal from './components/ClinicPortal';

function App() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<WorkerPortal />} />
          <Route path="/clinic" element={<ClinicPortal />} />
        </Routes>
      </main>
      
      <footer style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '1.5rem 0', textAlign: 'center', marginTop: 'auto' }}>
        <div className="container">
          <p>SWASTHYA Theme Project - Blockchain-anchored Health ID Prototype</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Built for Tech & AI for Social Good 2026</p>
        </div>
      </footer>
    </>
  );
}

export default App;
