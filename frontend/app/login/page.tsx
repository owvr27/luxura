'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const submit = async () => {
    setMsg(null);
    setLoading(true);
    try {
      const response = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) });
      // Backend wraps payload in { success, data: { user, token } }
      const payload = response?.data || response;
      const user = payload?.user || {
        id: payload?.id || String(Date.now()),
        name: payload?.name || 'User',
        email: form.email,
        role: payload?.role || 'user',
        createdAt: payload?.createdAt || new Date().toISOString(),
      };
      const token = payload?.token;
      if (!token) throw new Error('فشل تسجيل الدخول: لم يتم استلام رمز المصادقة');
      login(user, token);
      setMsg('تم تسجيل الدخول بنجاح! جاري التحويل...');
      router.push('/account');
    } catch (e: any) { 
      setMsg(e.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">مرحباً بعودتك إلى Luxora Environmental</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
              placeholder="البريد الإلكتروني" 
              value={form.email} 
              onChange={(e)=>setForm({...form,email:e.target.value})}
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
            <input 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" 
              type="password" 
              placeholder="كلمة المرور" 
              value={form.password} 
              onChange={(e)=>setForm({...form,password:e.target.value})}
            />
          </div>
          
          <button 
            onClick={submit} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-green-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </div>
        
        {msg && (
          <div className={`mt-4 p-3 rounded-lg text-center ${msg.includes('نجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ليس لديك حساب؟{' '}
            <a href="/register" className="text-green-600 hover:text-green-700 font-semibold">
              سجل الآن
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}