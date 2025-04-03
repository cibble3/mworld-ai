import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MinimalTestPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'girls',
            limit: 5,
            debug: true
          }
        });
        setData(response.data);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Minimal Test</h1>
      <div>
        <h2>API Response:</h2>
        <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto', maxHeight: '400px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      <div>
        <h2>Models:</h2>
        {data.data?.models?.length > 0 ? (
          <ul>
            {data.data.models.map(model => (
              <li key={model.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd' }}>
                <div><strong>Name:</strong> {model.name}</div>
                <div><strong>ID:</strong> {model.id}</div>
                <div>
                  <strong>Image:</strong> 
                  <img 
                    src={model.thumbnail} 
                    alt={model.name}
                    width="200" 
                    style={{ display: 'block', marginTop: '5px' }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No models found</div>
        )}
      </div>
    </div>
  );
};

export default MinimalTestPage; 