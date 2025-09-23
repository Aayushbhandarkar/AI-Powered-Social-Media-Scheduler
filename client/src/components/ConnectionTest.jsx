import { useEffect } from 'react'
import { testBackendConnection } from '../api'

const ConnectionTest = () => {
  useEffect(() => {
    const testConnection = async () => {
      console.log('Testing backend connection...')
      const result = await testBackendConnection()
      console.log('Connection test result:', result)
    }
    
    testConnection()
  }, [])

  return (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <h3>Connection Test</h3>
      <p>Check browser console for connection status</p>
      <button onClick={() => testBackendConnection().then(console.log)}>
        Test Connection
      </button>
    </div>
  )
}

export default ConnectionTest
