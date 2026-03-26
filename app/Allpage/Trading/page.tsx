"use client";
import React, { useState, useEffect } from 'react'; 
import { TrendingUp, TrendingDown, Landmark, Loader2, X, AlertCircle, Palette, Package, Hash } from 'lucide-react';
import { ethers } from 'ethers';
import { after } from 'node:test';

export default function MarketPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); 
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBuying, setIsBuying] = useState(false); 
  const [userRole, setUserRole] = useState(null); // เพิ่ม state สำหรับเก็บ role

  const brandsMap = { 0: "All", 1: "Chanel", 2: "Louis Vuitton", 3: "Dior", 4: "Gucci" };

  const closeModal = () => {
    if (!isBuying) setSelectedItem(null); 
  };
  
  

  const fetchTradingData = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/product/trading', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const tradingItems = data.data || [];
      setProducts(tradingItems);
      setFilteredProducts(tradingItems);
      
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  // ดึง Role และข้อมูลเริ่มต้น
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role.toLowerCase());
    }
    fetchTradingData();
  }, []);

  // Logic การกรองข้อมูลเมื่อเปลี่ยน Tab
  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => brandsMap[item.brand_id] === activeTab);
      setFilteredProducts(filtered);
    }
  }, [activeTab, products]);

  const handleConfirmBuy = async () => {
  if (!selectedItem) return;
  const token = localStorage.getItem('token');
  
  try {
    setIsBuying(true); // เริ่มสถานะ Loading

    // 1. เตรียมการเชื่อมต่อ Blockchain
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    const ESCROW_ADDRESS = "0xFe96a382831b84992643886791c8eD872fD0AA8F";
    const escrowContract = new ethers.Contract(ESCROW_ADDRESS, [
      "function listings(uint256) public view returns (address seller, address buyer, uint256 price, bool confirmed, bool active)",
      "function tradingBuy(uint256 tokenId) external payable"
    ], signer);

    // 2. ดึงข้อมูลราคาจาก Blockchain โดยตรง (เพื่อป้องกันราคาไม่ตรงกับ DB)
    // หมายเหตุ: ต้องใช้ tokenId ที่บันทึกไว้ใน DB ของสินค้านั้นๆ
    const tokenId = selectedItem.token_id; 
    const listing = await escrowContract.listings(tokenId);
    
    if (!listing.active) {
      throw new Error("สินค้านี้ไม่ได้เปิดการขายบน Blockchain");
    }

    const priceToPay = listing.price; // ราคาในหน่วย Wei จาก Contract

    // 3. เรียกฟังก์ชัน tradingBuy และส่งเงิน ETH (msg.value) ไปด้วย
    console.log(`กำลังสั่งซื้อ Token ID: ${tokenId} ด้วยราคา: ${ethers.formatEther(priceToPay)} ETH`);
    
    // ต้องใส่ { value: priceToPay } เพื่อให้ msg.value ในสัญญาทำงานได้
    const tx = await escrowContract.tradingBuy(tokenId, { value: priceToPay });
    
    alert("กรุณารอการยืนยันธุรกรรมบน Blockchain...");
    await tx.wait(); // รอจนกว่าธุรกรรมจะสำเร็จ

    // 4. เมื่อ Blockchain สำเร็จแล้ว จึงเรียก API ของ Backend เพื่ออัปเดต Database
    console.log("Blockchain Transaction Success, updating database...");
    
    const response = await fetch(`http://localhost:8000/api/product/${selectedItem.id}/buyasset`, {
      method: 'PATCH', // หรือ POST ตามที่ Route คุณกำหนดไว้
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (response.ok) {
      alert("ซื้อสินค้าและโอนกรรมสิทธิ์สำเร็จเรียบร้อย!");
      setSelectedItem(null); // ปิด Modal
      fetchTradingData(); // รีเฟรชหน้าจอ
    } else {
      throw new Error(result.message || "อัปเดตฐานข้อมูลไม่สำเร็จ");
    }

  } catch (error) {
    console.error("Buy Error:", error);
    // แจ้งเตือนข้อผิดพลาดตามจริง
    if (error.code === 'ACTION_REJECTED') {
      alert("คุณกดยกเลิกธุรกรรมบน MetaMask");
    } else {
      alert(`เกิดข้อผิดพลาด: ${error.reason || error.message}`);
    }
  } finally {
    setIsBuying(false);
  }
};

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-12 text-black">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Landmark className="text-[#D4A017]" size={28} />
            <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Trading Floor</h1>
          </div>

          <div className="flex gap-8 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar">
            {Object.values(brandsMap).map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveTab(brand)}
                className={`pb-2 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === brand 
                    ? "text-black border-b-2 border-black" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-[#D4A017]" size={40} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-50 bg-[#FAFAFA]">
                    <th className="px-8 py-6">Serial</th>
                    <th className="px-8 py-6">Model</th>
                    <th className="px-8 py-6">Color</th>
                    <th className="px-8 py-6">Owner</th>
                    <th className="px-8 py-6">Price (ETH)</th>
                    <th className="px-8 py-6">Change</th>
                    {/* แสดงหัวตาราง Action เฉพาะ user */}
                    {userRole === 'user' && <th className="px-8 py-6 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={userRole === 'user' ? "7" : "6"} className="px-8 py-20 text-center text-gray-400 font-medium">
                        No active listings found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <Hash size={14} className="text-[#D4A017]" />
                            <span className="font-bold text-gray-900 tracking-wider">{item.serial}</span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="font-bold text-gray-800">{item.model}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-bold">{brandsMap[item.brand_id]}</div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Palette size={16} className="text-gray-400" />
                            <span className="text-sm font-medium">{item.color}</span>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                            {item.owner_email ? item.owner_email : `ID: ${item.current_owner_id}`}
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="text-xl font-bold">{Number(item.price).toLocaleString()} ETH</div>
                        </td>

                        <td className="px-8 py-6">
                          <div className={`flex items-center gap-1 font-bold text-sm ${item.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {item.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {item.change}
                          </div>
                        </td>

                        {/* ตรวจสอบเงื่อนไข userRole === 'user' เพื่อแสดงปุ่ม */}
                        {userRole === 'user' && (
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setSelectedItem(item)}
                              className="bg-[#D4A017] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-sm">
                              Buy Asset
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <p>Market Vol: <span className="text-black ml-2">1,250,400 ETH</span></p>
            <p>Results: <span className="text-black ml-2">{filteredProducts.length} Items</span></p>
        </div>
      </div>

      {/* --- Purchase Confirmation Modal --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Confirm Purchase</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-[0.2em] mb-3">Ownership Transfer</p>
                <h4 className="font-bold text-xl text-black mb-1">{selectedItem.model}</h4>
                <p className="text-gray-500 text-sm mb-2">Serial: {selectedItem.serial} — {brandsMap[selectedItem.brand_id]}</p>
                <p className="text-gray-400 text-[10px] font-mono truncate">Merchant: {selectedItem.owner_email || 'Verified Seller'}</p>
                
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-400 uppercase font-black">Total Amount</span>
                  <span className="text-2xl font-black text-black">
                    {Number(selectedItem.price).toLocaleString()} ETH
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={closeModal} className="py-4 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmBuy}
                  disabled={isBuying}
                  className="py-4 rounded-2xl text-sm font-bold bg-[#D4A017] text-white hover:bg-black shadow-lg shadow-[#D4A017]/30 transition-all flex items-center justify-center gap-2"
                >
                  {isBuying ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Payment'}
                </button>
              </div>
            </div>
            <div className="bg-black p-3 flex items-center gap-2 justify-center">
              <AlertCircle size={14} className="text-[#D4A017]" />
              <p className="text-[11px] text-white font-medium">Secure settlement via luxury asset ledger.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}