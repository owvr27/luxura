'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  availability: string;
  description: string;
}

export default function Rewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('Fetching rewards from:', apiUrl);
        
        const res = await fetch(`${apiUrl}/rewards`);
        console.log('Response status:', res.status);
        
        const contentType = res.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        // Only parse as JSON if content-type is JSON
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          console.log('Rewards data:', data);
          setRewards(Array.isArray(data) ? data : []);
        } else {
          const text = await res.text();
          console.error('Non-JSON response:', text);
          throw new Error('Invalid response format from server');
        }
      } catch (e: any) { 
        console.error('Rewards fetch error:', e);
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
            <p className="text-gray-600">Loading rewards...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header - Centered */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Rewards Store</h1>
            <p className="text-lg text-gray-600 mb-6">Redeem your recycling points for amazing rewards</p>
          </div>

          {/* Error Message - Centered */}
          {msg && (
            <div className="mb-8 flex justify-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl w-full">
                <p className="font-semibold"> Error</p>
                <p className="text-sm mt-1">{msg}</p>
              </div>
            </div>
          )}

          {/* Rewards Grid - Centered */}
          {rewards.length > 0 ? (
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
                {rewards.map((reward) => (
                  <div key={reward.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    
                    {/* Reward Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          {reward.availability}
                        </span>
                        <span className="text-3xl"></span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                      <p className="text-white/90 text-sm">{reward.description}</p>
                    </div>

                    {/* Reward Content */}
                    <div className="p-6 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-2xl mr-2"></span>
                        <span className="text-2xl font-bold text-green-600">{reward.pointsRequired}</span>
                        <span className="text-gray-500 ml-1">points</span>
                      </div>
                      
                      <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                        Redeem Reward
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Rewards Available</h3>
              <p className="text-gray-600">Check back later for new rewards and offers</p>
            </div>
          )}

          {/* Debug Info - Centered */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>Rewards Count:</strong> {rewards.length}</p>
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
