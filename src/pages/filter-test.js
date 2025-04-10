import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FilterTestPage() {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'girls',
    hair_color: '',
    ethnicity: '',
    body_type: ''
  });

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/real-models-test?${params.toString()}`);
      if (response.data.success) {
        setModels(response.data.normalizedModels || []);
      } else {
        setError(response.data.error || 'Failed to load models');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchModels();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Filter Test Page</h1>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1">Category</label>
            <select 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="girls">Girls</option>
              <option value="trans">Trans</option>
              <option value="fetish">Fetish</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Hair Color</label>
            <select 
              name="hair_color" 
              value={filters.hair_color} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Any</option>
              <option value="blonde">Blonde</option>
              <option value="black">Black</option>
              <option value="brown">Brown</option>
              <option value="red">Red</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Ethnicity</label>
            <select 
              name="ethnicity" 
              value={filters.ethnicity} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Any</option>
              <option value="asian">Asian</option>
              <option value="latin">Latin</option>
              <option value="white">White</option>
              <option value="ebony">Ebony</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1">Body Type</label>
            <select 
              name="body_type" 
              value={filters.body_type} 
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Any</option>
              <option value="skinny">Skinny</option>
              <option value="petite">Petite</option>
              <option value="athletic">Athletic</option>
              <option value="medium">Medium</option>
              <option value="curvy">Curvy</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </form>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {models.map(model => (
          <div key={model.id} className="border rounded overflow-hidden">
            <div className="relative pb-[56.25%]">
              <img 
                src={model.thumbnail || 'https://via.placeholder.com/320x180'} 
                alt={model.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-2">
              <p className="font-bold truncate">{model.name}</p>
              <p className="text-sm text-gray-600">{model.ethnicity}</p>
              <p className="text-xs text-gray-500">
                {model.filters?.hair_color && `Hair: ${model.filters.hair_color}, `}
                {model.filters?.body_type && `Body: ${model.filters.body_type}`}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {models.length === 0 && !loading && !error && (
        <div className="p-4 text-center text-gray-500">
          No models found with the selected filters.
        </div>
      )}
    </div>
  );
} 