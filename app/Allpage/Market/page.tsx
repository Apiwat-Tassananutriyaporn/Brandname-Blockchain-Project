"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Hash, Palette, X, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';

export default function MarketPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [userRole, setUserRole] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api/product/';
  const brandsMap = { 0: "All", 1: "Chanel", 2: "Louis Vuitton", 3: "Dior", 4: "Gucci" };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role.toLowerCase());
    }

    const fetchMarketData = async () => {
      try {
        const token = localStorage.getItem('token');
         const response = await fetch('http://localhost:8000/api/product/market', {
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
        setFilteredProducts(result);
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => brandsMap[item.brand_id] === activeTab);
      setFilteredProducts(filtered);
    }
  }, [activeTab, products]);

  const openConfirmModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmBuy = () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    
    if (userRole !== 'user') return alert("Only users can access Escrow service.");

    const query = new URLSearchParams({
      model: selectedProduct.model,
      id: selectedProduct.id,
      serial: selectedProduct.serial,
      price: selectedProduct.price,
    }).toString();

    setIsModalOpen(false);
    router.push(`/Allpage/Escrow?${query}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-12 relative">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-black mb-6 uppercase tracking-tight">Marketplace</h1>
          <div className="flex gap-8 border-b border-gray-200 pb-2 overflow-x-auto">
            {Object.values(brandsMap).map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveTab(brand)}
                className={`pb-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === brand ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400 animate-pulse">Authenticating items...</div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-50 hover:shadow-md transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-[#F3F3F3] rounded-2xl flex items-center justify-center font-serif font-black text-gray-300 text-xl">
                    {brandsMap[item.brand_id]?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black leading-tight">{item.model}</h3>
                    <p className="text-gray-400 text-sm">by {brandsMap[item.brand_id]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 my-4 md:my-0">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Palette size={16} />
                    <span className="text-sm font-medium">{item.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-[#D4A017]" />
                    <span className="text-sm font-bold text-gray-900">{item.serial}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <p className="text-xl font-bold text-black">{Number(item.price).toLocaleString()} ETH</p>
                  
                  {userRole === 'user' && (
                    <button 
                      onClick={() => openConfirmModal(item)}
                      className="bg-[#D4A017] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedProduct && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
  
  <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Market</h2>
        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
        <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-[0.2em] mb-3">Escrow Item</p>
        <h4 className="font-bold text-xl text-black mb-1">{selectedProduct.model}</h4>
        <p className="text-gray-500 text-sm mb-5">{brandsMap[selectedProduct.brand_id]}</p>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-400 uppercase font-black">Total Price</span>
          <span className="text-2xl font-black text-black">฿{Number(selectedProduct.price).toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsModalOpen(false)}
          className="py-4 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirmBuy}
          className="py-4 rounded-2xl text-sm font-bold bg-[#D4A017] text-white hover:bg-black shadow-lg shadow-[#D4A017]/30 transition-all flex items-center justify-center gap-2"
        >
          Confirm <ArrowRight size={16} />
        </button>
      </div>
    </div>
    
    <div className="bg-black p-3 flex items-center gap-2 justify-center">
      <AlertCircle size={14} className="text-[#D4A017]" />
      <p className="text-[11px] text-white font-medium">You will be redirected to the Blockchain Escrow</p>
    </div>
  </div>
</div>
      )}
    </div>
  );
}