'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import ProtectedRoute from '../../components/ProtectedRoute';

interface ScanData {
  userName: string;
  date: string;
  trashItems: {
    type: string;
    quantity: number;
    points: number;
  }[];
  totalPoints: number;
}

export default function ScanPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setIsScanning(true);
      setError(null);
    } catch (err) {
      setError('Cannot access camera');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateScan = () => {
    const mockData: ScanData = {
      userName: user?.name || 'Unknown User',
      date: new Date().toLocaleDateString(),
      trashItems: [
        { type: 'Plastic', quantity: 5, points: 25 },
        { type: 'Glass', quantity: 3, points: 15 },
        { type: 'Paper', quantity: 2, points: 10 },
        { type: 'Metal', quantity: 1, points: 20 }
      ],
      totalPoints: 70
    };
    
    setScanResult(mockData);
    stopCamera();
  };

  const submitScan = async () => {
    if (!scanResult) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/operations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...scanResult,
          binId: `BIN-${Date.now()}`,
          userId: user?.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit scan data');
      }
      
      router.push('/account?scanSuccess=true');
    } catch (err) {
      setError('Failed to submit scan data');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setError(null);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              QR Code Scanner
            </h1>
            <p className="text-gray-600">
              Scan QR codes to track recycling and earn points
            </p>
          </div>

          {/* Scanner Section */}
          {!scanResult ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              
              {/* Camera View */}
              <div className="mb-6">
                {isScanning ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-96 bg-black rounded-xl object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-green-500 rounded-xl pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-green-400 rounded-lg"></div>
                    </div>
                    <button
                      onClick={stopCamera}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      Stop
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-4">
                        Camera is off
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-4 justify-center">
                {!isScanning ? (
                  <>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Start Camera
                    </button>
                    <button
                      onClick={simulateScan}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Simulate Scan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={simulateScan}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Simulate QR Detection
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Scan Results
              </h2>
              
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">User Name</p>
                  <p className="font-semibold">{scanResult.userName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="font-semibold">{scanResult.date}</p>
                </div>
              </div>

              {/* Trash Items */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Recycled Items
                </h3>
                <div className="space-y-3">
                  {scanResult.trashItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">{item.quantity}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.type}</p>
                          <p className="text-sm text-gray-600">items</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">+{item.points}</p>
                        <p className="text-sm text-gray-600">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Points */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">Total Points Earned</p>
                    <p className="text-3xl font-bold">{scanResult.totalPoints}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={submitScan}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit & Earn Points'}
                </button>
                <button
                  onClick={resetScan}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Scan Again
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              How to Use
            </h3>
            <ol className="space-y-2 text-blue-700">
              <li>1. Click "Start Camera" to activate the scanner</li>
              <li>2. Point camera at QR code on smart bin</li>
              <li>3. Wait for automatic detection or use "Simulate Scan" for testing</li>
              <li>4. Review scanned data and submit to earn points</li>
            </ol>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
