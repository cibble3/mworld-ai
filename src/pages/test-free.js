import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TestFreePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get('/api/test-free-api');
        console.log('API response:', response.data);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error testing API:', err);
        setError(err.message || 'An error occurred while testing the API');
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Free API Test Page</h1>
      <p>This page tests the direct connection to the Chaturbate API.</p>
      
      {loading && <p>Loading data from API...</p>}
      
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffeeee', border: '1px solid #ff0000', borderRadius: '5px', marginBottom: '20px' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div>
          <div style={{ padding: '15px', backgroundColor: '#eeffee', border: '1px solid #00ff00', borderRadius: '5px', marginBottom: '20px' }}>
            <h3>Success!</h3>
            <p>{data.message}</p>
            <p>Total results: {data.count}</p>
          </div>
          
          {data.firstResult && (
            <div>
              <h3>Sample Result</h3>
              <div style={{ padding: '15px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '5px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                  {JSON.stringify(data.firstResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h3>Next Steps</h3>
        <ul>
          <li>
            <a href="/free" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Test the actual FREE page
            </a>
          </li>
          <li>
            <a href="/api/models?provider=free&limit=10" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Test the models API with FREE provider
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
} 