'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface RedeemItem {
  id: string;
  reward: string;
  points: number;
  date: string;
  status: string;
}

export default function Redeem() {
  const [history, setHistory] = useState<RedeemItem[]>([]);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRedeemHistory();
  }, []);

  const fetchRedeemHistory = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Fetching redeem history from:', apiUrl);
      
      const res = await fetch(`${apiUrl}/redeem`);
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
        console.log('Redeem data:', data);
        setHistory(Array.isArray(data.history) ? data.history : []);
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response format from server');
      }
    } catch (e: any) { 
      console.error('Redeem fetch error:', e);
      setMsg(e.message); 
    } finally {
      setLoading(false);
    }
  };

  const redeem = async () => {
    if (!code.trim()) {
      setMsg('Please enter a redeem code');
      return;
    }

    setMsg(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      
      setMsg(`Successfully redeemed! Points added: ${data.pointsAdded || 100}`);
      setCode('');
      fetchRedeemHistory(); // Refresh history
    } catch (e: any) { 
      setMsg(e.message); 
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading redeem history...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Redeem Points</h1>
            <p className="text-lg text-gray-600 mb-6">Convert your points into amazing products and services</p>
          </div>

          {/* Error Message */}
          {msg && (
            <div className="mb-8 flex justify-center">
              <div className={`${msg.includes('Successfully') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-6 py-4 rounded-xl text-center max-w-2xl w-full`}>
                <p className="font-semibold">{msg.includes('Successfully') ? ' Success' : ' Error'}</p>
                <p className="text-sm mt-1">{msg}</p>
              </div>
            </div>
          )}

          {/* Redeem Code Section */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Enter Redeem Code</h3>
              <div className="space-y-4">
                <input 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-center"
                  placeholder="Enter your redeem code" 
                  value={code} 
                  onChange={(e)=>setCode(e.target.value)}
                />
                <button 
                  onClick={redeem} 
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Redeem Code
                </button>
              </div>
            </div>
          </div>

          {/* Redeem History */}
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Redeem History</h3>
              
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          <span className="text-xl"> </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.reward}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">-{item.points}</p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4"> </div>
                  <p className="text-gray-600">No redeem history yet</p>
                  <p className="text-sm text-gray-500 mt-2">Enter a redeem code above to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>History Count:</strong> {history.length}</p>
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
