"use client";
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function MarketPage() {
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
                <th className="px-8 py-6">Symbol</th>
                <th className="px-8 py-6">Asset</th>
                <th className="px-8 py-6">Owner</th>
                <th className="px-8 py-6">Price (USDT)</th>
                <th className="px-8 py-6">Change</th>
                <th className="px-8 py-6">Extra</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {marketItems.map((item, index) => (
                <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                  {/* Symbol */}
                  <td className="px-8 py-6 font-bold text-[#E2AD28] font-serif text-lg">
                    {item.symbol}
                  </td>

                  {/* Asset Details */}
                  <td className="px-8 py-6">
                    <div className="font-bold text-gray-800">{item.brand}</div>
                    <div className="text-xs text-gray-400">{item.model}</div>
                  </td>

                  {/* Owner */}
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium text-gray-700">{item.owner}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-tight">{item.ownerType}</div>
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
                    <button className="bg-white border border-[#E2AD28] text-[#E2AD28] px-8 py-2 rounded-lg font-bold text-sm hover:bg-[#E2AD28] hover:text-white transition-all shadow-sm active:scale-95">
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
    </div>
  );
}