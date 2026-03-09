"use client";
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  serial: string;
  brand_id: number;
  model: string;
  color: string;
  current_owner_id: any;
  status: string;
  type: string;
  price: number;
  created_at: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const [registerData, setRegisterData] = useState({ email: '', serialNumber: '' });

  const [newProduct, setNewProduct] = useState({
    serial: '',
    Brand: 'Louis Vuitton',
    model: '',
    color: '',
    price: '',
    type: 'Real', 
    status: 'In Custody'
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token'); 
      const response = await fetch('http://localhost:8000/api/product/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 401) {
        alert("Session หมดอายุ กรุณา Login ใหม่");
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      const result = Array.isArray(data) ? data : (data.products || data.data || []);
      setProducts(result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ เชื่อมต่อ API Register Product กับ Backend
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/product/register', {
        method: 'PATCH', // ใช้ PATCH ตามที่ระบุใน Router
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: registerData.email,
          serial: registerData.serialNumber // ส่ง 'serial' ให้ตรงกับ Backend
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Success: ${result.message}`);
        setRegisterData({ email: '', serialNumber: '' });
        fetchProducts(); // Refresh ตารางเพื่อดูสถานะใหม่
      } else {
        // จัดการกรณี Error เช่น หา Email ไม่เจอ หรือ Serial ไม่ถูกต้อง
        alert(`Error: ${result.message || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("Failed to connect to server");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/product/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price)
        })
      });

      if (response.ok) {
        alert("Add Product Successful!!");
        setIsModalOpen(false);
        setNewProduct({ serial: '', Brand: 'Louis Vuitton', model: '', color: '', price: '', type: 'Real', status: 'In Custody' });
        fetchProducts();
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      alert("Failed to connect to server");
    }
  };

  const filteredProducts = products.filter(item => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8 text-black pb-20 font-sans selection:bg-[#E2AD28]/30">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section 1: Register */}
        <div className="text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">Register New Asset</h1>
            <p className="text-gray-400 text-sm">Assign digital identities to luxury goods on the blockchain.</p>
          </div>
          <div className="bg-white rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100 p-12 max-w-4xl mx-auto">
            <form onSubmit={handleRegister} className="flex flex-col md:flex-row items-end gap-10">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 w-full text-left">
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Owner Email</label>
                  <input
                    type="email" required value={registerData.email} placeholder="Enter owner email"
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:border-[#E2AD28] outline-none transition-all text-gray-800"
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Serial Number</label>
                  <input
                    type="text" required value={registerData.serialNumber} placeholder="e.g. LV123"
                    className="w-full bg-transparent border-b border-gray-200 py-3 focus:border-[#E2AD28] outline-none transition-all text-gray-800 font-mono"
                    onChange={(e) => setRegisterData({...registerData, serialNumber: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full md:w-auto bg-[#E2AD28] text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-[0_10px_20px_rgba(226,173,40,0.2)]">
                Confirm
              </button>
            </form>
          </div>
        </div>

        {/* Section 2: Status Table */}
        <div className="space-y-6">
          <div className="flex justify-between items-end gap-4 px-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Custody Status</h2>
              <p className="text-gray-400 text-xs">Real-time inventory of authenticated assets.</p>
            </div>
            
            <div className="flex gap-3 items-center">
              <button onClick={fetchProducts} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-black hover:border-gray-300 transition-all active:scale-95 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${isLoading ? 'animate-spin' : ''}`}
                ><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>Refresh</button>
              <div className="relative">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-white border border-gray-100 text-gray-600 px-4 py-2.5 pr-10 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="In Custody">In Custody</option>
                  <option value="With Owner">With Owner</option>
                  <option value="Sold">Sold</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>

              <button onClick={() => setIsModalOpen(true)} className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-[#E2AD28] transition-all">+ Add Product</button>
            </div>
          </div>
          
          <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400">Loading assets...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-50">
                      <th className="px-8 py-6">Serial</th>
                      <th className="px-8 py-6">Model</th>
                      <th className="px-8 py-6">Color</th>
                      <th className="px-8 py-6">Current Owner</th>
                      <th className="px-8 py-6">Type</th>
                      <th className="px-8 py-6 text-right">Price (THB)</th>
                      <th className="px-8 py-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {filteredProducts.length > 0 ? filteredProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 font-bold text-[#E2AD28] tracking-tighter">{item.serial}</td>
                        <td className="px-8 py-6 text-gray-800 font-semibold">{item.model}</td>
                        <td className="px-8 py-6 text-gray-500 italic">{item.color}</td>
                        <td className="px-8 py-6 text-gray-400 font-mono text-xs">{item.current_owner_id ? `ID: ${item.current_owner_id}` : 'NULL (In Custody)'}</td>
                        <td className="px-8 py-6"><span className={`text-[12px] px-2 py-1 rounded-md font-bold ${item.type === 'Asset' 
                        ? 'bg-amber-50 text-amber-600 border-amber-100/50' 
                        : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>{item.type}</span></td>
                        <td className="px-8 py-6 text-right font-bold text-gray-700">{item.price?.toLocaleString()}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             item.status === 'In Custody' ? 'bg-amber-50 text-amber-600 border-amber-100/50'
                            : item.status === 'With Owner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>{item.status}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} className="px-10 py-20 text-center text-gray-400 font-medium">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ MODAL POPUP: Add Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8  flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Add New Luxury Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black transition-colors">✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="px-8 space-y-5 pb-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Serial Number</label>
                  <input required type="text" placeholder="e.g. SN1023" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, serial: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Brand</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, Brand: e.target.value})}>
                    <option value="Louis Vuitton">Louis Vuitton</option>
                    <option value="Chanel">Chanel</option>
                    <option value="Dior">Dior</option>
                    <option value="Gucci">Gucci</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Model Name</label>
                  <input required type="text" placeholder="e.g. Classic Flap" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, model: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Product Type</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}>
                    <option value="Real">Real Product</option>
                    <option value="Asset">Digital Asset</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Color</label>
                  <input required type="text" placeholder="Black / Gold" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Price (THB)</label>
                  <input required type="number" placeholder="95000" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#E2AD28] outline-none"
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}/>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-white border border-gray-100 text-gray-400 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 hover:text-black transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#E2AD28] transition-all shadow-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}