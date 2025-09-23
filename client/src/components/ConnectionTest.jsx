import React, { useEffect } from 'react';
import api from './api';

const ConnectionTest = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing backend connection...');
        const response = await api.get('/health');
        console.log('Backend response:', response.data);
      } catch (error) {
        console.error('Connection failed:', error);
      }
    };
    
    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Connection Test - Check browser console</h3>
      <button onClick={() => api.get('/health').then(r => console.log(r.data))}>
        Test Backend
      </button>
    </div>
  );
};

export default ConnectionTest;
