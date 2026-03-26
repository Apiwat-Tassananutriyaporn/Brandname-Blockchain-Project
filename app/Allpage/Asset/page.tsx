"use client";
import React, { useState, useEffect } from 'react'; 
import { TrendingUp, TrendingDown, Package, Loader2, Palette, X, AlertCircle, Hash,Briefcase } from 'lucide-react';
import { ethers } from 'ethers';

export default function MyAssetPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // เพิ่มตัวแปรสำหรับ Filter
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // เพิ่ม state สำหรับ Tab
  const [selectedItem, setSelectedItem] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api/product';
  // แผนผังแบรนด์เหมือนหน้า Collection
  const brandsMap = { 0: "All", 1: "Chanel", 2: "Louis Vuitton", 3: "Dior", 4: "Gucci" };

  const closeModal = () => {
    if (!isActionLoading) setSelectedItem(null); 
  };
  
  const fetchMyAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/product/asset', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const assets = data.data || [];
      setProducts(assets);
      setFilteredProducts(assets); // เซ็ตค่าเริ่มต้นให้แสดงทั้งหมด
      
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logic สำหรับการกรองข้อมูลเมื่อเปลี่ยน Tab
  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => brandsMap[item.brand_id] === activeTab);
      setFilteredProducts(filtered);
    }
  }, [activeTab, products]);

  const handleConfirmSell = async () => {
    if (!selectedItem) return;
    const token = localStorage.getItem('token');
    try {
      setIsActionLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // --- ส่วน Debug -----------------------
      const network = await provider.getNetwork();
      console.log("Current Chain ID:", network.chainId);
      //เชื่อมต่อกับ Smart Contracts
      const NFT_ADDRESS = "0x8a868F9dF8162c13731e38589a3d8Cd7cBBc6E26"; //
      const ESCROW_ADDRESS = "0xFe96a382831b84992643886791c8eD872fD0AA8F"; //
      //----------------------
      const code = await provider.getCode(NFT_ADDRESS);
        if (code === "0x") {
            console.error("Error: ไม่พบ Smart Contract ที่ Address นี้!");
            alert("Contract Address ผิด หรืออยู่ผิด Network");
            return;
        }
        // -----------------

      const nftContract = new ethers.Contract(NFT_ADDRESS, [
        "function serialToTokenId(string memory serial) public view returns (uint256)",
        "function approve(address to, uint256 tokenId) public"
      ], signer);

      const escrowContract = new ethers.Contract(ESCROW_ADDRESS, [
        "function listProduct(uint256 tokenId, uint256 price) external"
      ], signer);

      // 3. ดึง tokenId มาเพื่อทำการ Approve (จำเป็นต้องใช้ ID ในการ Approve)
      const tokenId = await nftContract.serialToTokenId(selectedItem.serial); //
      if (tokenId === BigInt(0)) throw new Error("ไม่พบสินค้าชิ้นนี้บน Blockchain");

      // 4. ขั้นตอน Blockchain Step 1: Approve ให้ Escrow มีสิทธิ์ดึงของ
      alert("กรุณายืนยันการ Approve สินค้าใน MetaMask");
      const approveTx = await nftContract.approve(ESCROW_ADDRESS, tokenId);
      await approveTx.wait();

      // 5. ขั้นตอน Blockchain Step 2: สั่ง List ด้วย Serial (ตามที่คุณจะแก้ใน .sol)
      alert("กำลังนำสินค้าเข้าสู่ระบบ Escrow...");

     // แปลงราคาจากบาทเป็น Wei (หรือหน่วยที่ใช้ใน Contract)
      const priceInEth = ethers.parseUnits(selectedItem.price.toString(), "ether"); 
      const listTx = await escrowContract.listProduct(tokenId, priceInEth);
      await listTx.wait();

      await fetch(`${API_BASE_URL}/${selectedItem.id}/sellasset`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("สินค้าของคุณถูกนำลงขายเรียบร้อยแล้ว!");
      setSelectedItem(null);
      fetchMyAssets();
      
    } catch (error) {
      console.error("Sell failed:", error);
      alert("เกิดข้อผิดพลาด: ไม่สามารถนำสินค้าลงขายได้");
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAssets();
  }, []); 

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-12 text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header ปรับปรุงใหม่ให้เหมือนหน้า Collection --- */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-[#D4A017]" />
            <h1 className="text-3xl font-bold text-black uppercase tracking-tight">My Digital Assets</h1>
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-50 bg-[#FAFAFA]">
                  <th className="px-8 py-6">Serial</th>
                  <th className="px-8 py-6">Model</th>
                  <th className="px-8 py-6">Color</th>
                  <th className="px-8 py-6">Value (USDT)</th>
                  <th className="px-8 py-6">Performance</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-gray-400 font-medium">
                      No assets found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
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
                        <div className="text-xl font-bold">{Number(item.price).toLocaleString()} ETH</div>
                      </td>

                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-1 font-bold text-sm ${item.isPositive !== false ? 'text-green-500' : 'text-red-500'}`}>
                          {item.isPositive !== false ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {item.change || '0%'}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="bg-[#D4A017] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-sm">
                          Sell Asset
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Portfolio Summary */}
        <div className="mt-8 flex justify-end gap-10 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <p>Portfolio Value: <span className="text-black ml-2">
              {filteredProducts.reduce((acc, curr) => acc + Number(curr.price), 0).toLocaleString()} USDT
            </span></p>
            <p>Assets Displayed: <span className="text-black ml-2">{filteredProducts.length} Items</span></p>
        </div>
      </div>

      {/* --- Sell Confirmation Modal --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">List Asset for Sale</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-[0.2em] mb-3">Authentication Verified</p>
                <h4 className="font-bold text-xl text-black mb-1">{selectedItem.model}</h4>
                <p className="text-gray-500 text-sm mb-5">Serial: {selectedItem.serial} — {selectedItem.color}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-400 uppercase font-black">Listing Price</span>
                  <span className="text-2xl font-black text-black">
                    ${Number(selectedItem.price).toLocaleString()} <span className="text-sm font-medium text-gray-500">USDT</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={closeModal} className="py-4 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmSell}
                  disabled={isActionLoading}
                  className="py-4 rounded-2xl text-sm font-bold bg-[#D4A017] text-white hover:bg-black shadow-lg shadow-[#D4A017]/30 transition-all flex items-center justify-center gap-2"
                >
                  {isActionLoading ? <Loader2 className="animate-spin" size={18} /> : 'Confirm Listing'}
                </button>
              </div>
            </div>
            <div className="bg-black p-3 flex items-center gap-2 justify-center">
              <AlertCircle size={14} className="text-[#D4A017]" />
              <p className="text-[11px] text-white font-medium">By listing this item, it will be moved to the public trading floor.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}