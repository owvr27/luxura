'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Bin {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  fillLevel: number;
  lastUpdated: string;
  type: string;
}

export default function Bins() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('Fetching bins from:', apiUrl);
        
        const res = await fetch(`${apiUrl}/bins`);
        console.log('Response status:', res.status);
        
        const contentType = res.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Bins data:', data);
          setBins(Array.isArray(data) ? data : []);
        } else {
          const text = await res.text();
          console.error('Non-JSON response:', text);
          throw new Error('Invalid response format from server');
        }
      } catch (e: any) { 
        console.error('Bins fetch error:', e);
        setMsg(e.message); 
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading smart bins...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Smart Bins</h1>
            <p className="text-lg text-gray-600 mb-6">Find and track Luxora Environmental smart recycling bins</p>
            <div className="flex justify-center gap-4">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                Active: {bins.filter(b => b.status === 'active').length}
              </div>
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                Maintenance: {bins.filter(b => b.status === 'maintenance').length}
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                Total: {bins.length}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {msg && (
            <div className="mb-8 flex justify-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl w-full">
                <p className="font-semibold"> Error</p>
                <p className="text-sm mt-1">{msg}</p>
              </div>
            </div>
          )}

          {/* Bins Grid */}
          {bins.length > 0 ? (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                {bins.map((bin) => (
                  <div key={bin.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    
                    {/* Bin Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20`}>
                          {bin.status}
                        </span>
                        <span className="text-3xl"></span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{bin.name}</h3>
                      <p className="text-white/90 text-sm">{bin.location}</p>
                    </div>

                    {/* Bin Content */}
                    <div className="p-6">
                      {/* Fill Level */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Fill Level</span>
                          <span className="text-sm font-bold text-gray-900">{bin.fillLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${getFillLevelColor(bin.fillLevel)}`}
                            style={{ width: `${bin.fillLevel}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Coordinates</p>
                        <p className="text-sm text-gray-600">
                          {bin.latitude.toFixed(4)}, {bin.longitude.toFixed(4)}
                        </p>
                      </div>

                      {/* Last Updated */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-1">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {new Date(bin.lastUpdated).toLocaleString()}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                          {bin.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Smart Bins Available</h3>
              <p className="text-gray-600">Check back later for available smart bins in your area</p>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>Bins Count:</strong> {bins.length}</p>
                  <p><strong>Error:</strong> {msg || 'None'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
