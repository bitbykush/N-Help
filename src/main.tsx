import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { EmergencyProvider } from './context/EmergencyContext';
import { CommunicationProvider } from './context/CommunicationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EmergencyProvider>
      <CommunicationProvider>
        <App />
      </CommunicationProvider>
    </EmergencyProvider>
  </React.StrictMode>
);
