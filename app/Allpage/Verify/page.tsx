"use client";
import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Tag, Palette, AlertCircle, 
  CheckCircle2, History, User, ArrowDown, ShoppingBag 
} from 'lucide-react';

export default function VerifyPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Mock Data สำหรับประวัติการครอบครอง (จำลองการ Join ตาราง User กับ Product)
  const mockOwnershipHistory = [
    { id: 1, firstname: "Apiwat", lastname: "Tass", role: "Original Owner", transfer_date: "2026-02-20", type: "Store Purchase" },
    { id: 2, firstname: "Saka", lastname: "Tass", role: "Previous Owner", transfer_date: "2026-03-05", type: "Resell" },
    { id: 3, firstname: "James", lastname: "Hill", role: "Current Owner", transfer_date: "2026-03-25", type: "Current" },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialNumber) return;

    setIsSearching(true);
    setResult(null);
    setErrorMsg('');
    
    try {
      // จำลองการ Fetch (ในระบบจริงส่วนนี้จะได้รับ Data ที่มี Array ของ History มาด้วย)
      const response = await fetch(`http://localhost:8000/api/product/${serialNumber}/verify`);
      const data = await response.json();
      console.log("data: ", data.ProductData);
      console.log("ownership history: ", data.OwnershipHistory);
      if (response.ok && data.ProductData) {
        const productData = Array.isArray(data.ProductData) ? data.ProductData[0] : data.ProductData;
        const ownershipHistory = Array.isArray(data.OwnershipHistory) ? data.OwnershipHistory : [];
        if (productData) {
          // เพิ่ม Mock History เข้าไปใน Object ผลลัพธ์
          setResult({
            ...productData,
            history: ownershipHistory // ในงานจริงข้อมูลนี้ควรมาจาก API
          });
        } else {
          setResult("not_found");
          setErrorMsg("ไม่พบข้อมูลสินค้าชิ้นนี้");
        }
      } else {
        setResult("not_found");
        setErrorMsg(data.message || "ไม่พบข้อมูลในระบบ");
      }
    } catch (error: any) {
      setResult("not_found");
      setErrorMsg("การเชื่อมต่อขัดข้อง");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-4 md:p-8 text-black font-sans">
      <div className="max-w-3xl mx-auto pt-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4 shadow-sm">
            <ShieldCheck className="text-[#E2AD28]" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] mb-2 uppercase">Asset Verifier</h1>
          <p className="text-gray-500">ตรวจสอบความแท้และประวัติการเปลี่ยนมือของสินค้า</p>
        </div>

        <form onSubmit={handleSearch} className="relative mb-10">
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            placeholder="กรอก Serial Number (เช่น LV123, DR328)"
            className="w-full bg-white border border-gray-200 px-6 py-5 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#E2AD28] outline-none pr-36 text-lg transition-all"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-3 bottom-3 bg-black text-white px-8 rounded-xl font-bold hover:bg-[#E2AD28] transition-all flex items-center gap-2"
          >
            {isSearching ? "Searching..." : "Verify"}
          </button>
        </form>

        {result === "not_found" && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <AlertCircle size={24} />
            <p className="font-bold">{errorMsg}</p>
          </div>
        )}

        {result && result !== "not_found" && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            {/* Main Product Card */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-[#E2AD28] p-4 flex justify-between items-center px-8">
                <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Authenticity Verified</span>
                <span className="bg-white text-[#E2AD28] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {result.history?.length > 1 ? "Second Hand" : "First Hand"}
                </span>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-[#E2AD28] text-sm font-black uppercase tracking-widest mb-1">
                      {result.type || "LUXURY ASSET"}
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">{result.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Serial Number</p>
                    <p className="text-lg font-mono font-bold text-gray-800">{result.serial}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-gray-50 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <Palette size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Colorway</p>
                      <p className="text-sm font-bold">{result.color || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                      <p className="text-sm font-bold text-gray-900">
                        {result.price ? `${Number(result.price).toLocaleString()} ETH` : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Ownership</p>
                      <p className="text-sm font-bold text-gray-900">{result.history?.length} Owners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Timeline Card */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-8">
                <History className="text-[#E2AD28]" size={20} />
                <h3 className="text-lg font-bold">Ownership History</h3>
              </div>

              <div className="space-y-0 relative">
                {result.history?.map((owner: any, index: number) => (
                  <div key={owner.id} className="relative">
                    {/* Line connection */}
                    {index !== result.history.length - 1 && (
                      <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-gray-100"></div>
                    )}
                    
                    <div className="flex gap-6 mb-10 last:mb-0 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-sm ${
                        index === result.history.length - 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <User size={20} />
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{owner.firstname} {owner.lastname}</p>
                            <p className="text-xs text-gray-500">{owner.role}</p>
                          </div>
                          <p className="text-xs font-mono text-gray-400">{owner.transfer_date}</p>
                        </div>
                        <div className="mt-2 text-[10px] inline-block px-2 py-0.5 rounded bg-gray-50 text-gray-400 font-bold uppercase tracking-wider">
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status Footer */}
            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">Verified System Status</span>
              </div>
              <span className="text-sm font-black text-green-800 italic uppercase">
                {result.status || "In System"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}