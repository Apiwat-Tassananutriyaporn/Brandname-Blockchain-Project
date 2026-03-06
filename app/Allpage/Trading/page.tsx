"use client";
import React, { useState, useEffect } from 'react'; 
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';

export default function MarketPage() {
  // 2. สร้าง State สำหรับเก็บข้อมูล API (ค่าเริ่มต้นเป็นอาร์เรย์ว่าง)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // ฟังก์ชันสำหรับปิด Modal
  const closeModal = () => setSelectedItem(null);
  
  // 3. ฟังก์ชันดึงข้อมูล API
  const fetchTradingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/product/trading', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setProducts(data.data || []); // เก็บข้อมูลที่ได้จาก API ลงใน State
      console.log("products:", products); // แสดงข้อมูลที่ได้จาก API ใน Console
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. สั่งให้ทำงานทันทีที่โหลดหน้า
  useEffect(() => {
    fetchTradingData();
  }, []); // [] หมายถึงทำแค่ครั้งเดียวตอนโหลดหน้า



  // ข้อมูลจำลองสำหรับ Trading Floor
  const marketItems = [
    {
      symbol: "HRM.B35",
      brand: "Hermès",
      model: "Birkin 35 · Gold Togo",
      owner: "Hermès Manufacture",
      ownerType: "Manufacturer",
      price: "15,200",
      change: "+2.7%",
      isPositive: true,
      extra: "+$150"
    },
    {
      symbol: "LV.NVF",
      brand: "Louis Vuitton",
      model: "Neverfull MM · Monogram Canvas",
      owner: "Somsak Luxury",
      ownerType: "Holder",
      price: "2,850",
      change: "+5.6%",
      isPositive: true,
      extra: null
    },
    {
      symbol: "CHN.CF",
      brand: "Chanel",
      model: "Classic Flap Medium · Black Caviar",
      owner: "Natcha Collection",
      ownerType: "Holder",
      price: "10,800",
      change: "-3.6%",
      isPositive: false,
      extra: null
    },
    {
      symbol: "HRM.K28",
      brand: "Hermès",
      model: "Kelly 28 · Etoupe Epsom",
      owner: "Hermès Manufacture",
      ownerType: "Manufacturer",
      price: "22,500",
      change: "+7.1%",
      isPositive: true,
      extra: "+$200"
    },
    {
      symbol: "GCC.DIO",
      brand: "Gucci",
      model: "Dionysus Small · Beige/Ebony GG",
      owner: "Premium Resellers BKK",
      ownerType: "Holder",
      price: "3,450",
      change: "+7.8%",
      isPositive: true,
      extra: null
    }
  ];
  console.log("marketItems :", marketItems); // แสดงข้อมูลที่จะแสดงในตารางใน Console

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8 text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-serif mb-2">Trading Floor</h1>
          <p className="text-gray-500 text-lg">Luxury Asset Stock Exchange</p>
        </div>

        {/* Trading Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-50 bg-[#FAFAFA]">
                <th className="px-8 py-6">Serial</th>
                <th className="px-8 py-6">Model</th>
                <th className="px-8 py-6">Owner</th>
                <th className="px-8 py-6">Price (USDT)</th>
                <th className="px-8 py-6">Change</th>
                <th className="px-8 py-6">Extra</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((item, index) => (
                <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                  {/* Serial */}
                  <td className="px-8 py-6 font-bold text-[#E2AD28] font-serif text-lg">
                    {item.serial}
                  </td>

                  {/* Asset Details */}
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-800">{item.model}</div>
                    <div className="text-xs text-gray-400">{item.color}</div>
                  </td>

                  {/* Owner */}
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-gray-700">{item.owner_name}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tight">{item.status}</div>
                  </td>

                  {/* Price */}
                  <td className="px-8 py-6">
                    <div className="text-xl font-bold">${item.price}</div>
                  </td>

                  {/* Change */}
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-1 font-bold text-sm ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {item.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {item.change}
                    </div>
                  </td>

                  {/* Extra */}
                  <td className="px-8 py-6">
                     {item.extra ? (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                        <DollarSign size={10} /> {item.extra}
                      </div>
                    ) : (
                      <span className="text-gray-200">—</span>
                    )}
                  </td>

                  {/* Buy Button */}
                  <td className="px-8 py-6 text-right">
                    <button 
                    onClick={() => setSelectedItem(item)}
                    className="bg-white border border-[#E2AD28] text-[#E2AD28] px-8 py-2 rounded-lg font-bold text-sm hover:bg-[#E2AD28] hover:text-white transition-all shadow-sm active:scale-95">
                      Buy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market Stats Footer (Optional) */}
        <div className="mt-8 flex justify-end gap-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <p>Total Volume: <span className="text-black ml-2">1,250,400 USDT</span></p>
            <p>Active Listings: <span className="text-black ml-2">48 Assets</span></p>
        </div>
      </div>
      {/* โค้ด Modal จะทำงานเมื่อ selectedItem มีค่าเท่านั้น */}
{selectedItem && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
      
      {/* ปุ่มปิด (X) */}
      <button 
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold font-serif mb-4 text-[#E2AD28]">Confirm Purchase</h2>
      
      <div className="space-y-4 border-t border-b border-gray-50 py-6 my-4">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Serial</span>
          <span className="font-bold">{selectedItem.serial}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Model</span>
          <span className="font-bold">{selectedItem.model}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Current Owner</span>
          <span className="font-mono text-sm">{selectedItem.owner_name}</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="text-gray-400 text-sm">Total Price</span>
          <span className="text-2xl font-black text-black">${selectedItem.price} USDT</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={closeModal}
          className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button 
          className="flex-1 py-3 rounded-xl font-bold bg-[#E2AD28] text-white hover:bg-[#c99a24] shadow-lg shadow-orange-200 transition-all active:scale-95"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}