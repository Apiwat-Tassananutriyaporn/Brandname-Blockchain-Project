import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';

// ข้อมูลจำลอง (Mock Data) สำหรับหน้า Market
const marketItems = [
  {
    id: 1,
    brand: "Louis Vuitton",
    model: "Neverfull MM",
    sn: "FL2094",
    price: "45,500",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop" // ลิงก์รูปภาพตัวอย่าง
  },
  {
    id: 2,
    brand: "Dior",
    model: "Lady Dior Medium",
    sn: "DR8842",
    price: "120,000",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    brand: "Hermès",
    model: "Birkin 30 Gold",
    sn: "HM9901",
    price: "680,000",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=500&auto=format&fit=crop"
  }
];

export default function MarketPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="px-12 py-12 max-w-7xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-500 text-lg">Browse and shop authentic pre-loved luxury pieces.</p>
      </header>

      {/* --- Product Grid --- */}
      <main className="px-12 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {/* Image Section */}
              <div className="bg-[#f7f7f7] h-80 flex items-center justify-center p-8">
                <img 
                  src={item.image} 
                  alt={item.model} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Detail Section */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl font-bold text-[#D4A017]">{item.brand}</h3>
                  <span className="font-semibold text-gray-900">฿{item.price}</span>
                </div>
                <p className="text-gray-700 font-medium">{item.model}</p>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-wider">SN: {item.sn}</p>
                
                {/* Buy Button */}
                <button className="w-full mt-6 py-3 px-4 border border-[#D4A017] text-[#D4A017] rounded-xl font-bold hover:bg-[#D4A017] hover:text-white transition-colors duration-200">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}