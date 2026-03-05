"use client";
import React, { useState } from 'react';

// ข้อมูลจำลองสำหรับแสดงในตาราง
const mockProducts = [
  { id: "p1", brandName: "Hermès", model: "Birkin 25", color: "Gold", yearOfProduction: "2023", serialNumber: "B-ST-123-HER" },
  { id: "p2", brandName: "Chanel", model: "Classic Flap Medium", color: "Black", yearOfProduction: "2022", serialNumber: "CH-321098XX" },
  { id: "p3", brandName: "Louis Vuitton", model: "Keepall 50", color: "Monogram", yearOfProduction: "2024", serialNumber: "DR4214-LV" },
  { id: "p4", brandName: "Rolex", model: "Submariner", color: "Green", yearOfProduction: "2021", serialNumber: "RX-998877-Z" },
  { id: "p5", brandName: "Dior", model: "Lady Dior", color: "Cloud Blue", yearOfProduction: "2023", serialNumber: "09-BO-1223" }
];

export default function AdminPage() {
  const [products, setProducts] = useState(
    mockProducts.map(item => ({
      ...item,
      currentOwner: "Pending",
      status: "In Custody",
      lastVerified: "2026-02-21"
    }))
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registerData, setRegisterData] = useState({ email: '', serialNumber: '' });
  const [newProduct, setNewProduct] = useState({ brandName: '', model: '', color: '', year: '', sn: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts(products.map(p => 
      p.serialNumber === registerData.serialNumber 
      ? { ...p, currentOwner: registerData.email, status: "With Owner" } 
      : p
    ));
    setRegisterData({ email: '', serialNumber: '' });
    alert(`Success: Ownership assigned to ${registerData.email}`);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([{
      id: `p${Date.now()}`,
      brandName: newProduct.brandName,
      model: newProduct.model,
      color: newProduct.color,
      yearOfProduction: newProduct.year,
      serialNumber: newProduct.sn,
      currentOwner: "Pending",
      status: "In Custody",
      lastVerified: new Date().toISOString().split('T')[0]
    }, ...products]);
    setIsModalOpen(false);
    setNewProduct({ brandName: '', model: '', color: '', year: '', sn: '' });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8 text-black pb-20 font-sans selection:bg-[#E2AD28]/30">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* ส่วนที่ 1: Register Section (Centered UI) */}
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">Register New Asset</h1>
            <p className="text-gray-400 text-sm">Assign digital identities to luxury goods on the blockchain.</p>
          </div>

          <div className="bg-white rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 p-12 max-w-4xl mx-auto">
            <form onSubmit={handleRegister} className="flex flex-col md:flex-row items-end gap-10">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 w-full text-left">
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#E2AD28]">
                    Owner Email
                  </label>
                  <input
                    type="email" required value={registerData.email} placeholder="Enter owner email"
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:border-[#E2AD28] outline-none transition-all text-gray-800 placeholder:text-gray-200"
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-focus-within:text-[#E2AD28]">
                    Serial Number
                  </label>
                  <input
                    type="text" required value={registerData.serialNumber} placeholder="e.g. B-ST-123-HER"
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:border-[#E2AD28] outline-none transition-all text-gray-800 placeholder:text-gray-200 font-mono"
                    onChange={(e) => setRegisterData({...registerData, serialNumber: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-auto pb-1">
                <button 
                  type="submit" 
                  className="w-full md:w-auto bg-[#E2AD28] text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-[0_10px_20px_rgba(226,173,40,0.2)] active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ส่วนที่ 2: Status Table (Clean Design) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 px-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Custody Status</h2>
              <p className="text-gray-400 text-xs">Real-time inventory of authenticated assets.</p>
            </div>
            <div className="flex gap-3">
              <select className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white border border-gray-100 text-[#E2AD28] outline-none cursor-pointer shadow-sm hover:border-[#E2AD28] transition-all">
                <option>All Assets</option>
                <option>With Owner</option>
                <option>In Custody</option>
              </select>
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#E2AD28] transition-all shadow-lg active:scale-95"
              >
                + Add Product
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-50">
                    <th className="px-10 py-6">Serial</th>
                    <th className="px-10 py-6">Model</th>
                    <th className="px-10 py-6">Current Owner</th>
                    <th className="px-10 py-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-10 py-6 font-bold text-[#E2AD28] font-mono tracking-tighter">{item.serialNumber}</td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-gray-800">{item.brandName} {item.model}</div>
                        <div className="text-[10px] text-gray-400 uppercase mt-0.5">{item.color} | {item.yearOfProduction}</div>
                      </td>
                      <td className="px-10 py-6 text-gray-400 font-mono italic">{item.currentOwner}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
                          item.status === 'In Custody' ? 'bg-orange-50 text-[#E2AD28] border-orange-100' : 'bg-stone-50 text-stone-400 border-stone-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal สำหรับ Add Product */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-gray-300 hover:text-black transition-colors text-xl">✕</button>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-black">New Luxury Item</h3>
                <p className="text-gray-400 text-xs">Enter product details for authentication.</p>
              </div>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <input type="text" placeholder="Brand Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#E2AD28] transition-all" onChange={e => setNewProduct({...newProduct, brandName: e.target.value})} />
                <input type="text" placeholder="Model" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#E2AD28] transition-all" onChange={e => setNewProduct({...newProduct, model: e.target.value})} />
                <input type="text" placeholder="Color/Material" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#E2AD28] transition-all" onChange={e => setNewProduct({...newProduct, color: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Year" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#E2AD28] transition-all" onChange={e => setNewProduct({...newProduct, year: e.target.value})} />
                  <input type="text" placeholder="Serial Number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-[#E2AD28] transition-all font-mono" onChange={e => setNewProduct({...newProduct, sn: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-[#E2AD28] text-white py-4 mt-4 rounded-2xl font-bold shadow-lg hover:bg-black transition-all">Confirm & Save</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}