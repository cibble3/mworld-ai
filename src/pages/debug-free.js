import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DebugFreePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [models, setModels] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    testFreeApi();
  }, []);

  const testFreeApi = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[DEBUG] Testing free API...');
      
      // Test the free-models API
      const response = await axios.get('/api/free-models', {
        params: {
          category: 'girls',
          limit: 10
        }
      });
      
      console.log('[DEBUG] API response:', response.status);
      setApiResponse(response.data);
      
      if (response.data.success) {
        setModels(response.data.data.models || []);
      } else {
        setError('API returned error: ' + (response.data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('[DEBUG] Error testing API:', err);
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Free API Debug Page</h1>
      <p>This is a minimal page to test the Chaturbate API integration directly.</p>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={testFreeApi}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test API Again'}
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#FFEBEE', 
          border: '1px solid #FFCDD2',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#D32F2F', margin: '0 0 10px 0' }}>Error:</h3>
          <p style={{ margin: '0' }}>{error}</p>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2>API Response:</h2>
          <pre style={{ 
            backgroundColor: '#F5F5F5', 
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px',
            fontSize: '14px'
          }}>
            {apiResponse ? JSON.stringify(apiResponse, null, 2) : 'No response yet'}
          </pre>
        </div>
        
        <div>
          <h2>Models ({models.length}):</h2>
          {models.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {models.map((model, index) => (
                <div key={index} style={{ 
                  width: '200px',
                  padding: '10px',
                  border: '1px solid #EEEEEE',
                  borderRadius: '4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                  <img 
                    src={model.thumbnail || '/placeholder.jpg'} 
                    alt={model.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <h3 style={{ margin: '10px 0 5px 0', fontSize: '16px' }}>{model.name}</h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    Viewers: {model.viewerCount || 0}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                    Provider: {model._provider || 'unknown'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No models found</p>
          )}
        </div>
      </div>
    </div>
  );
} 