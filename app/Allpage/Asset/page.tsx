"use client";
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

// ข้อมูลจำลองตามรูปภาพใหม่
const ASSET_DATA = [
  { id: 'HRM.B35', brand: 'Hermès', model: 'Birkin 35 · Gold Togo', owner: 'Hermès Manufacture', role: 'MANUFACTURER', price: 15200, change: 2.7, extra: '+$150', serial: 'HM-8821', material: 'Togo Leather', year: '2024' },
  { id: 'LV.NVF', brand: 'Louis Vuitton', model: 'Neverfull MM · Monogram Canvas', owner: 'Somsak Luxury', role: 'HOLDER', price: 2850, change: 5.6, extra: '—', serial: 'FL2094', material: 'Coated Canvas', year: '2024' },
  { id: 'CHN.CF', brand: 'Chanel', model: 'Classic Flap Medium · Black Caviar', owner: 'Natcha Collection', role: 'HOLDER', price: 10800, change: -3.6, extra: '—', serial: 'CH-1102', material: 'Lambskin', year: '2023' },
  { id: 'HRM.K28', brand: 'Hermès', model: 'Kelly 28 · Etoupe Epsom', owner: 'Hermès Manufacture', role: 'MANUFACTURER', price: 22500, change: 7.1, extra: '+$200', serial: 'HM-K991', material: 'Epsom Leather', year: '2024' },
  { id: 'GCC.DIO', brand: 'Gucci', model: 'Dionysus Small · Beige/Ebony GG', owner: 'Premium Resellers BKK', role: 'HOLDER', price: 3450, change: 7.8, extra: '—', serial: 'GC-5541', material: 'Canvas', year: '2024' },
];

export default function AssetTablePage() {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [modalType, setModalType] = useState<'graph' | 'sell'>('graph');

  const handleRowClick = (asset: any) => {
    setSelectedAsset(asset);
    setModalType('graph');
  };

  const handleSellClick = (e: React.MouseEvent, asset: any) => {
    e.stopPropagation();
    setSelectedAsset(asset);
    setModalType('sell');
  };

  return (
    <div className="p-8 bg-white min-h-screen text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">My Asset</h1>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-50">
                <th className="px-6 py-4 font-semibold">Symbol</th>
                <th className="px-6 py-4 font-semibold">Asset</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Price (USDT)</th>
                <th className="px-6 py-4 font-semibold text-center">Change</th>
                <th className="px-6 py-4 font-semibold">Extra</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ASSET_DATA.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => handleRowClick(item)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-5">
                    <span className="text-[#d4a017] font-bold text-lg">{item.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="font-bold text-gray-900">{item.brand}</div>
                    <div className="text-xs text-gray-400">{item.model}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-medium text-gray-700">{item.owner}</div>
                    <div className="text-[10px] text-gray-300 font-bold">{item.role}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xl font-bold text-gray-900">${item.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center justify-center font-bold ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change > 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-400 text-sm">
                    {item.extra !== '—' ? <span className="text-gray-300">$</span> : ''} {item.extra}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={(e) => handleSellClick(e, item)}
                      className="px-8 py-2 border border-[#d4a017] text-[#d4a017] rounded-lg font-bold hover:bg-[#d4a017] hover:text-white transition-all"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL LOGIC --- */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectedAsset(null)}
              className="absolute right-8 top-8 text-gray-300 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-[#d4a017] font-bold text-2xl mb-1">{selectedAsset.id}</h2>
            <p className="text-gray-400 text-sm mb-8">{selectedAsset.brand} — {selectedAsset.model.split('·')[0]}</p>

            {/* Content Switcher */}
            {modalType === 'graph' ? (
              <div className="mb-8">
                {/* Simulated Graph (Image 3) */}
                <div className="h-44 w-full mb-6 flex flex-col justify-end">
                  <svg viewBox="0 0 300 100" className="w-full">
                    <path d="M 0 70 L 60 62 L 120 55 L 180 50 L 240 42 L 300 30" fill="none" stroke="#d4a017" strokeWidth="3" />
                    {[0, 60, 120, 180, 240, 300].map((x, i) => (
                       <circle key={i} cx={x} cy={[70, 62, 55, 50, 42, 30][i]} r="4" fill="#d4a017" />
                    ))}
                  </svg>
                  <div className="flex justify-between text-[11px] text-gray-300 mt-4 px-1">
                    <span>M1</span><span>M2</span><span>M3</span><span>M4</span><span>M5</span><span>M6</span>
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-50">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Serial</span><span className="font-bold text-[#d4a017] uppercase">{selectedAsset.serial}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Material</span><span className="font-medium">{selectedAsset.material}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Year</span><span className="font-medium">{selectedAsset.year}</span></div>
                </div>
              </div>
            ) : (
              <div className="mb-8 animate-in slide-in-from-bottom-2 duration-300">
                {/* Sell View (Image 2) */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Serial</span><span className="font-bold text-[#d4a017] uppercase">{selectedAsset.serial}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Color</span><span className="font-medium text-gray-600">{selectedAsset.model.split('·')[1] || 'Standard'}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Material</span><span className="font-medium text-gray-600">{selectedAsset.material}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">Year</span><span className="font-medium text-gray-600">{selectedAsset.year}</span></div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-gray-600">{modalType === 'sell' ? 'Sell Price' : 'Current Price'}</span>
                <span className="text-2xl font-black">${selectedAsset.price.toLocaleString()} USDT</span>
              </div>

              {modalType === 'sell' && (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setSelectedAsset(null)} className="py-4 rounded-xl border border-gray-100 font-bold text-gray-400 hover:bg-gray-50">Cancel</button>
                  <button className="py-4 rounded-xl bg-[#d4a017] text-white font-bold hover:shadow-lg hover:shadow-yellow-600/20 transition-all">Confirm</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}