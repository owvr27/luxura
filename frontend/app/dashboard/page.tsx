'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

interface DashboardData {
  stats: {
    totalPoints: number;
    itemsRecycled: number;
    co2Saved: number;
    treesEquivalent: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    points: number;
    date: string;
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Fetching dashboard from:', apiUrl);
      
      const res = await fetch(`${apiUrl}/dashboard`);
      console.log('Response status:', res.status);
      
      const contentType = res.headers.get('content-type');
      console.log('Content type:', contentType);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      if (contentType && contentType.includes('application/json')) {
        const dashboardData = await res.json();
        console.log('Dashboard data:', dashboardData);
        setData(dashboardData);
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid response format from server');
      }
    } catch (e: any) { 
      console.error('Dashboard fetch error:', e);
      setMsg(e.message); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> Dashboard</h1>
            <p className="text-lg text-gray-600 mb-6">Welcome back, {user?.name || 'User'}! Here's your environmental impact</p>
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

          {data ? (
            <>
              {/* Stats Grid */}
              <div className="flex justify-center mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white text-center">
                    <div className="text-4xl mb-4"> </div>
                    <p className="text-3xl font-bold mb-2">{data.stats.totalPoints}</p>
                    <p className="text-white/90">Total Points</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white text-center">
                    <div className="text-4xl mb-4"> </div>
                    <p className="text-3xl font-bold mb-2">{data.stats.itemsRecycled}</p>
                    <p className="text-white/90">Items Recycled</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white text-center">
                    <div className="text-4xl mb-4"> </div>
                    <p className="text-3xl font-bold mb-2">{data.stats.co2Saved}</p>
                    <p className="text-white/90">kg CO2 Saved</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white text-center">
                    <div className="text-4xl mb-4"> </div>
                    <p className="text-3xl font-bold mb-2">{data.stats.treesEquivalent}</p>
                    <p className="text-white/90">Trees Equivalent</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recent Activity</h3>
                  
                  {data.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {data.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                              <span className="text-xl">+</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{activity.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">+{activity.points}</p>
                            <p className="text-sm text-gray-500">points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4"> </div>
                      <p className="text-gray-600">No recent activity</p>
                      <p className="text-sm text-gray-500 mt-2">Start recycling to see your activity here</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"> </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Not Available</h3>
              <p className="text-gray-600">Unable to load dashboard statistics</p>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>Stats Available:</strong> {data ? 'Yes' : 'No'}</p>
                  <p><strong>Activity Count:</strong> {data?.recentActivity.length || 0}</p>
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
