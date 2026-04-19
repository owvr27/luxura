'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Error');
        setData(d);
      } catch (e: any) { setMsg(e.message); }
    };
    run();
  }, []);
  return (
    <ProtectedRoute requireAdmin={true}>
      <div>
        <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
        {msg && <p>{msg}</p>}
        {data && (
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3">Total users: {data.totalUsers}</div>
            <div className="border p-3">Total operations: {data.totalOperations}</div>
            <div className="border p-3">Total bins: {data.totalBins}</div>
            <div className="border p-3">Points distributed: {data.pointsDistributed}</div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}