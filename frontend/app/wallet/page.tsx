'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

export default function Wallet() {
  const [data, setData] = useState<WalletData | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        console.log('Fetching wallet from:', apiUrl);
        
        const res = await fetch(`${apiUrl}/wallet`);
        console.log('Response status:', res.status);
        
        const contentType = res.headers.get('content-type');
        console.log('Content type:', contentType);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        if (contentType && contentType.includes('application/json')) {
          const walletData = await res.json();
          console.log('Wallet data:', walletData);
          setData(walletData);
        } else {
          const text = await res.text();
          console.error('Non-JSON response:', text);
          throw new Error('Invalid response format from server');
        }
      } catch (e: any) { 
        console.error('Wallet fetch error:', e);
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
            <p className="text-gray-600">Loading wallet...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> My Wallet</h1>
            <p className="text-lg text-gray-600 mb-6">Track your points balance and transaction history</p>
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
              {/* Balance Card */}
              <div className="flex justify-center mb-12">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center max-w-md w-full">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl"> </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Current Balance</h2>
                  <p className="text-5xl font-bold mb-4">{data.balance}</p>
                  <p className="text-white/90">points available</p>
                </div>
              </div>

              {/* Transactions */}
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Transaction History</h3>
                  
                  {data.transactions.length > 0 ? (
                    <div className="space-y-4">
                      {data.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              transaction.type === 'earned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              <span className="text-xl">
                                {transaction.type === 'earned' ? '+' : '-'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{transaction.description}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-bold ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                            </p>
                            <p className="text-sm text-gray-500">points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4"> </div>
                      <p className="text-gray-600">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4"> </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Wallet Not Available</h3>
              <p className="text-gray-600">Unable to load wallet information</p>
            </div>
          )}

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-12 flex justify-center">
              <div className="bg-gray-100 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Debug Information</h3>
                <div className="space-y-2 text-sm text-center">
                  <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
                  <p><strong>Balance:</strong> {data?.balance || 'N/A'}</p>
                  <p><strong>Transactions:</strong> {data?.transactions.length || 0}</p>
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
