"use client";
import React, { useState } from 'react';

export default function CollectionPage() {
  // ข้อมูลจำลองสำหรับสินค้า
  const collectionItems = [
    {
      id: 1,
      brand: "Louis Vuitton",
      model: "Neverfull MM",
      material: "Coated Canvas",
      color: "Monogram Canvas",
      year: "2024",
      sn: "FL2094",
      image: "https://images.vestiairecollective.com/images/resized/w=1246,q=75,f=auto,/produit/white-leather-lady-dior-dior-handbag-45065828-1_2.jpg",
      price: "2,850"
    },
    {
      id: 2,
      brand: "Dior",
      model: "Lady Dior Medium",
      material: "Lambskin",
      color: "Rose des Vents",
      year: "2023",
      sn: "DR8842",
      image: "https://www.christies.com/img/LotImages/2024/NYR/2024_NYR_23090_0047_000(a_gold_epsom_leather_birkin_30_with_gold_hardware_hermes_2023115022).jpg?mode=max&width=600",
      price: "5,200"
    }
  ];

  // State สำหรับควบคุม Pop-up
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-serif mb-2">My Collection</h1>
          <p className="text-gray-500 text-lg">Your authenticated luxury pieces</p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {collectionItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
              <div className="aspect-square bg-[#F5F5F5] relative overflow-hidden flex items-center justify-center p-8">
                <img src={item.image} alt={item.model} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              </div>
              <div className="p-6">
                <h3 className="text-[#E2AD28] font-bold text-xl mb-1">{item.brand}</h3>
                <p className="text-gray-600 text-sm mb-1">{item.model}</p>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">SN: {item.sn}</p>
                <button 
                  onClick={() => handleOpenModal(item)}
                  className="w-full border border-[#E2AD28] text-[#E2AD28] py-2.5 rounded-lg font-bold text-sm hover:bg-[#E2AD28] hover:text-white transition-all"
                >
                  List for Sale
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pop-up ยืนยันการขาย (Sale Confirmation Modal) */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl p-10 shadow-2xl relative animate-in zoom-in duration-200">
              {/* ปุ่มปิด (X) */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-8 top-8 text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>

              {/* หัวข้อ Pop-up */}
              <div className="mb-8">
                <h2 className="text-[#E2AD28] text-2xl font-bold uppercase tracking-wide">
                  {selectedItem.brand.split(' ')[0]}.{selectedItem.model.split(' ')[0].substring(0,3).toUpperCase()}
                </h2>
                <p className="text-gray-500 font-medium">{selectedItem.brand} — {selectedItem.model}</p>
              </div>

              {/* รายละเอียดสินค้า */}
              <div className="space-y-4 mb-10 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-400">Serial</span>
                  <span className="font-bold text-[#E2AD28]">{selectedItem.sn}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-400">Color</span>
                  <span className="font-medium text-gray-700">{selectedItem.color}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-400">Material</span>
                  <span className="font-medium text-gray-700">{selectedItem.material}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Year</span>
                  <span className="font-medium text-gray-700">{selectedItem.year}</span>
                </div>
              </div>

              {/* ราคาขาย */}
              <div className="flex justify-between items-end mb-10 pt-4 border-t border-gray-100">
                <span className="text-gray-400 font-bold">Listing Price</span>
                <span className="text-2xl font-bold text-black">${selectedItem.price} USDT</span>
              </div>

              {/* ปุ่ม Action */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 border border-gray-200 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Asset listed successfully on the market!');
                    setIsModalOpen(false);
                  }}
                  className="w-full py-4 bg-[#E2AD28] text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}