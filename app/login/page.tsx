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

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่ม Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh
    setError(''); // ล้างค่า Error เก่า
    
    try {
      // 3. ยิง API ไปที่ Backend (ปรับ URL ให้ตรงกับของคุณ)
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
        // 4. ถ้าสำเร็จ: เก็บ Token และย้ายหน้า
        localStorage.setItem('token', data.token); // เก็บ Token ไว้ในเครื่อง
        alert("Login Successful!");
        router.push('/Allpage/Admin'); 
      } else {
        // 5. ถ้าไม่สำเร็จ: แสดงข้อความ Error จาก Backend
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again later.");
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
      {/* ฝั่งซ้าย: Login Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center px-12 xl:px-24 bg-white">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
          <p className="text-gray-500 text-sm">Welcome! Please fill username and password to sign in into your account.</p>
        </div>

        {/* เพิ่ม onSubmit ให้กับ Form เพื่อเรียกใช้ handleLogin */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Header & Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] focus:border-transparent outline-none transition-all text-black placeholder:text-gray-300 shadow-sm"
              onChange={handleChange}
            />
          </div>

          {/* Password Header & Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#E2AD28] focus:border-transparent outline-none transition-all text-black placeholder:text-gray-300 shadow-sm"
              onChange={handleChange}
            />
          </div>
          
          <div className="text-right">
            <button type="button" className="text-sm font-semibold text-gray-400 hover:text-[#E2AD28] transition-colors">
              Forgot your password?
            </button>
          </div>

          {/* ปุ่ม Login จะเรียกใช้ handleLogin อัตโนมัติเมื่ออยู่ใน Form */}
          <button 
            type="submit"
            className="w-full bg-[#E2AD28] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95 uppercase tracking-widest mt-2"
          >
            Login Now
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => router.push('/register')} 
              className="text-black font-bold hover:text-[#E2AD28] underline underline-offset-4 transition-colors"
            >
              Register Now
            </button>
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: Hero Image */}
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