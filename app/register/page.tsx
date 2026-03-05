"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    idCard: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // เรียกไปที่ Route: router.post("/register", authController.register);
      // สมมติว่า Backend รันอยู่ที่พอร์ต 5000 และใช้ prefix /api/auth
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          phone: formData.phoneNumber, 
          idcard: formData.idCard // ส่งให้ตรงกับ user.idcard ใน Backend controller
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'การสมัครสมาชิกล้มเหลว');
      }

      alert("สมัครสมาชิกสำเร็จ!");
      router.push('/login'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-12 xl:px-24 bg-white overflow-y-auto py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Join LuxeChain to manage your luxury assets.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">First Name</label>
            <input
              name="firstname"
              type="text"
              required
              placeholder="Enter your first name"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Last Name</label>
            <input
              name="lastname"
              type="text"
              required
              placeholder="Enter your last name"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">Phone Number</label>
              <input
                name="phoneNumber"
                type="tel"
                required
                placeholder="081-234-5678"
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 ml-1">ID Card / Passport</label>
              <input
                name="idCard"
                type="text"
                required
                maxLength={13}
                placeholder="13-digit ID"
                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] outline-none text-black transition-all shadow-sm"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#E2AD28] hover:bg-black'} text-white py-4 mt-6 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95`}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Already a member?{' '}
            <button 
              onClick={() => router.push('/login')} 
              className="text-black hover:text-[#E2AD28] underline underline-offset-4 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-[60%] relative">
        <img 
          src="https://pbs.twimg.com/media/HAgZd9JXEAAhT2t.jpg" 
          alt="Luxury background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-20 text-white">
          <h1 className="text-5xl font-bold mb-4">LuxeChain</h1>
          <p className="text-lg text-gray-200 max-w-md font-light">
            Authenticate and manage your luxury assets on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}