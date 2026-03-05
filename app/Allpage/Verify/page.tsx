"use client";
import React, { useState } from 'react';
import { Search, ShieldCheck, Calendar, Palette, Tag } from 'lucide-react';

export default function VerifyPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  // จำลองฐานข้อมูลสำหรับตรวจสอบ (ในอนาคตจะดึงจาก API/Blockchain)
  const mockDatabase = [
    {
      sn: "B-ST-123-HER",
      brand: "Hermès",
      model: "Birkin 25",
      color: "Gold",
      year: "2023",
      status: "Authentic",
      lastVerified: "2026-02-15"
    },
    {
      sn: "FL2094",
      brand: "Louis Vuitton",
      model: "Neverfull MM",
      color: "Monogram",
      year: "2022",
      status: "Authentic",
      lastVerified: "2026-02-14"
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // จำลองการโหลดข้อมูล
    setTimeout(() => {
      const found = mockDatabase.find(item => item.sn.toLowerCase() === serialNumber.toLowerCase());
      setResult(found || "not_found");
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8 text-black">
      <div className="max-w-3xl mx-auto pt-10">
        
        {/* Header ส่วนหัว */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4">
            <ShieldCheck className="text-[#E2AD28]" size={32} />
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">Verify Asset Authenticity</h1>
          <p className="text-gray-500">Enter the serial number to verify the digital identity of your luxury item.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-12">
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="Enter Serial Number (e.g. B-ST-123-HER)"
            className="w-full bg-white border border-gray-200 px-6 py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#E2AD28] outline-none transition-all pr-36 text-lg"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 bg-black text-white px-8 rounded-xl font-bold hover:bg-[#E2AD28] transition-all flex items-center gap-2 disabled:bg-gray-300"
          >
            {isSearching ? "Searching..." : <><Search size={18} /> Verify</>}
          </button>
        </form>

        {/* Result Display */}
        {result === "not_found" && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600 animate-in fade-in slide-in-from-top-4">
            No record found for this serial number. Please check again.
          </div>
        )}

        {result && result !== "not_found" && (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-[#E2AD28] p-4 text-center text-white text-xs font-black uppercase tracking-[0.3em]">
              Authenticity Verified
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-[#E2AD28] text-sm font-black uppercase tracking-widest mb-1">{result.brand}</h2>
                  <p className="text-2xl font-bold">{result.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold">Serial Number</p>
                  <p className="text-lg font-mono font-bold text-gray-800">{result.sn}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-gray-50 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <Palette size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Colorway</p>
                    <p className="text-sm font-bold">{result.color}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Production Year</p>
                    <p className="text-sm font-bold">{result.year}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <span>Last verification check: {result.lastVerified}</span>
                <span className="flex items-center gap-1 text-green-500 font-bold">
                  <ShieldCheck size={14} /> Secured by LuxeChain
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}