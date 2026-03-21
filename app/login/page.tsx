"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (error) setError('');
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('firstname', data.firstname || '');
        localStorage.setItem('email', data.email || '');

        window.dispatchEvent(new Event('storage'));

        if (data.role === 'admin') {
          router.push('/Allpage/Admin');
        } else {
          router.push('/Allpage/Market');
        }
      } else {
        setError(data.message || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Connection failed. Please check your internet or server status.");
    } finally {
  
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-12 xl:px-24 bg-white">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
          <p className="text-gray-500 text-sm">Welcome! Please fill username and password to sign in into your account.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              disabled={loading}
              placeholder="Enter your email"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] focus:border-transparent outline-none transition-all text-black placeholder:text-gray-300 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              disabled={loading}
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] focus:border-transparent outline-none transition-all text-black placeholder:text-gray-300 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <button 
            type="submit"
            disabled={loading} 
            className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 uppercase tracking-widest mt-2 flex justify-center items-center gap-2
              ${loading 
                ? "bg-gray-400 cursor-not-allowed text-white" 
                : "bg-[#E2AD28] hover:bg-black text-white"
              }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Login Now"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => !loading && router.push('/register')} 
              disabled={loading}
              className="text-black font-bold hover:text-[#E2AD28] underline underline-offset-4 transition-colors disabled:text-gray-300"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[60%] relative">
        <img 
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070" 
          alt="Luxury background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-20 text-white">
          <h1 className="text-5xl font-bold mb-4 leading-tight">Start your <br/> journey now</h1>
          <p className="text-lg text-gray-200 max-w-md font-light">
            Start creating your amazing collection with us! Login into your account and verify your luxury assets.
          </p>
        </div>
      </div>
    </div>
  );
}