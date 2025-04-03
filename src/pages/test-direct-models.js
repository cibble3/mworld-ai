import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModelGrid from '@/theme/components/grid/ModelGrid';
import ModelCard from '@/theme/components/common/ModelCard';
import ThemeLayout from '@/theme/layouts/ThemeLayout';

const TestDirectModelsPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        console.log(`[TestDirectModels] Making direct API call to fetch models`);
        
        const response = await axios.get('/api/models', {
          params: {
            provider: 'awe',
            category: 'girls',
            limit: 20,
            debug: true
          }
        });
        
        console.log(`[TestDirectModels] API response success:`, response.data?.success);
        
        if (response.data?.success) {
          const items = response.data.data?.models || [];
          console.log(`[TestDirectModels] Received ${items.length} models`);
          
          if (items.length > 0) {
            console.log(`[TestDirectModels] First model:`, JSON.stringify(items[0]).substring(0, 200));
          }
          
          setModels(items);
        } else {
          setError('API returned error: ' + (response.data?.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(`[TestDirectModels] Error fetching models:`, err);
        setError(err.message || 'Error fetching models');
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);

  return (
    <ThemeLayout title="Test Direct Models">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Test Direct Models Page</h1>
        
        {loading ? (
          <div className="text-center py-10">Loading models directly...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : models.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No models found.</div>
        ) : (
          <div>
            <div className="mb-4 text-green-600 font-semibold">
              Found {models.length} models via direct API call
            </div>
            <ModelGrid models={models} isLoading={false}>
              {(model) => (
                <ModelCard 
                  key={model.id || model.slug} 
                  performerId={model.id || model.slug}
                  name={model.name || 'Unknown'}
                  age={model.age}
                  ethnicity={model.ethnicity}
                  tags={model.tags || []}
                  image={model.thumbnail}
                  isOnline={model.isOnline !== false}
                  viewerCount={model.viewerCount || 0}
                />
              )}
            </ModelGrid>
          </div>
        )}
      </div>
    </ThemeLayout>
  );
};

export default TestDirectModelsPage; 