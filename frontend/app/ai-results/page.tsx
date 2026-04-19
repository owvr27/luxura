'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Classification {
  image_path: string;
  classification: {
    category: string;
    confidence: number;
    description: string;
    points: number;
    recyclable: boolean;
  };
  all_classifications: Array<{
    category: string;
    confidence: number;
    description: string;
    points: number;
    recyclable: boolean;
  }>;
  timestamp: string;
  success: boolean;
}

interface AIStats {
  total_images: number;
  total_points: number;
  categories: {
    [key: string]: {
      count: number;
      points: number;
    };
  };
  average_confidence: number;
  success_rate: number;
}

export default function AIResults() {
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [stats, setStats] = useState<AIStats | null>(null);
  const [lastClassification, setLastClassification] = useState<Classification | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('Fetching AI results from:', apiUrl);
      
      // Fetch classifications
      const classRes = await fetch(`${apiUrl}/classifications`);
      const classData = await classRes.json();
      console.log('Classifications data:', classData);
      
      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/stats`);
      const statsData = await statsRes.json();
      console.log('Stats data:', statsData);
      
      // Fetch last classification
      const lastRes = await fetch(`${apiUrl}/last/classification`);
      if (lastRes.ok) {
        const lastData = await lastRes.json();
        setLastClassification(lastData);
      }
      
      setClassifications(classData.classifications || []);
      setStats(statsData);
    } catch (e: any) { 
      console.error('AI results fetch error:', e);
      setMsg(e.message); 
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      plastic: '🍶',
      paper: '📄',
      metal: '🥫',
      glass: '🍾',
      organic: '🌿',
      electronic: '📱',
      other: '♻️'
    };
    return icons[category] || '♻️';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      plastic: 'bg-blue-100 text-blue-800',
      paper: 'bg-yellow-100 text-yellow-800',
      metal: 'bg-gray-100 text-gray-800',
      glass: 'bg-green-100 text-green-800',
      organic: 'bg-green-100 text-green-800',
      electronic: 'bg-purple-100 text-purple-800',
      other: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI results...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> AI Classification Results</h1>
            <p className="text-lg text-gray-600 mb-6">View AI-powered waste classification and recycling insights</p>
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

          {/* Stats Overview */}
          {stats && (
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2"> </div>
                  <p className="text-3xl font-bold mb-2">{stats.total_images}</p>
                  <p className="text-white/90">Images Processed</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2"> </div>
                  <p className="text-3xl font-bold mb-2">{stats.total_points}</p>
                  <p className="text-white/90">Total Points Earned</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2"> </div>
                  <p className="text-3xl font-bold mb-2">{stats.success_rate}%</p>
                  <p className="text-white/90">Success Rate</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white text-center">
                  <div className="text-3xl mb-2"> </div>
                  <p className="text-3xl font-bold mb-2">{stats.average_confidence}%</p>
                  <p className="text-white/90">Avg Confidence</p>
                </div>
              </div>
            </div>
          )}

          {/* Last Classification */}
          {lastClassification && lastClassification.success && (
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Latest Classification</h3>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {getCategoryIcon(lastClassification.classification.category)}
                    </div>
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${getCategoryColor(lastClassification.classification.category)}`}>
                      {lastClassification.classification.category.toUpperCase()}
                    </div>
                    <p className="text-lg text-gray-700 mb-2">{lastClassification.classification.description}</p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="text-xl font-bold text-blue-600">
                          {(lastClassification.classification.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Points</p>
                        <p className="text-xl font-bold text-green-600">
                          +{lastClassification.classification.points}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {stats && stats.categories && Object.keys(stats.categories).length > 0 && (
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Category Breakdown</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.categories).map(([category, data]) => (
                    <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{category}</p>
                          <p className="text-sm text-gray-600">{data.count} items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">+{data.points}</p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Classification History */}
          {classifications.length > 0 && (
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Classification History</h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {classifications.map((classification, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(classification.classification.category)}`}>
                          <span className="text-lg">{getCategoryIcon(classification.classification.category)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">{classification.classification.category}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(classification.timestamp).toLocaleDateString()} at {new Date(classification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">+{classification.classification.points}</p>
                        <p className="text-sm text-gray-500">
                          {(classification.classification.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {classifications.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"> </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No AI Classifications Yet</h3>
              <p className="text-gray-600">Upload images from your ESP32 camera to see AI classification results</p>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>Classifications:</strong> {classifications.length}</p>
                  <p><strong>Total Points:</strong> {stats?.total_points || 0}</p>
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
