import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeLayout from '@/theme/layouts/ThemeLayout';

const DiagnosticPage = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testVpapiConnection = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call our diagnostic endpoint
        const response = await axios.get('/api/diagnostic/vpapi-test');
        setApiResponse(response.data);
      } catch (err) {
        console.error('Diagnostic error:', err);
        setError(err.message || 'Failed to test VPAPI connection');
        setApiResponse(err.response?.data);
      } finally {
        setIsLoading(false);
      }
    };
    
    testVpapiConnection();
  }, []);

  return (
    <ThemeLayout 
      meta={{
        title: "VPAPI Diagnostic",
        description: "Diagnostic page for testing VPAPI connectivity",
      }}
      title="VPAPI Diagnostic"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">VPAPI Connection Diagnostic</h1>
        
        {isLoading && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded mb-4">
            Testing VPAPI connection...
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            <h2 className="font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}
        
        {apiResponse && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">VPAPI Configuration</h2>
              <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded overflow-x-auto">
                {JSON.stringify(apiResponse.diagnostic?.config, null, 2)}
              </pre>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">Environment</h2>
              <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded overflow-x-auto">
                {JSON.stringify(apiResponse.diagnostic?.environment, null, 2)}
              </pre>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">Request</h2>
              <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded overflow-x-auto">
                {JSON.stringify(apiResponse.diagnostic?.request, null, 2)}
              </pre>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <h2 className="font-bold mb-2">Response</h2>
              <div className="mb-2">
                <span className="font-bold">Status:</span> {apiResponse.diagnostic?.response?.status}
              </div>
              <div className="mb-2">
                <span className="font-bold">Success:</span> {apiResponse.diagnostic?.response?.success ? 'Yes' : 'No'}
              </div>
              <div className="mb-2">
                <span className="font-bold">Timing:</span> {apiResponse.diagnostic?.response?.timing}
              </div>
              {apiResponse.diagnostic?.response?.videoCount !== undefined && (
                <div className="mb-2">
                  <span className="font-bold">Video Count:</span> {apiResponse.diagnostic?.response?.videoCount}
                </div>
              )}
              
              {apiResponse.diagnostic?.response?.firstVideo && (
                <div className="mb-2">
                  <h3 className="font-bold">Sample Video</h3>
                  <pre className="whitespace-pre-wrap bg-gray-900 text-white p-4 rounded overflow-x-auto">
                    {JSON.stringify(apiResponse.diagnostic?.response?.firstVideo, null, 2)}
                  </pre>
                </div>
              )}
              
              {apiResponse.diagnostic?.response?.error && (
                <div className="mb-2">
                  <h3 className="font-bold text-red-600">Error Details</h3>
                  <pre className="whitespace-pre-wrap bg-red-900 text-white p-4 rounded overflow-x-auto">
                    {JSON.stringify(apiResponse.diagnostic?.response?.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ThemeLayout>
  );
};

export default DiagnosticPage; 