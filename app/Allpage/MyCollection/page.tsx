"use client";
import React, { useState, useEffect } from 'react';
import { Hash, Palette, X, AlertCircle, Package } from 'lucide-react';
import {ethers} from 'ethers';

export default function CollectionPage() {
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/api/product';
  const brandsMap = { 0: "All", 1: "Chanel", 2: "Louis Vuitton", 3: "Dior", 4: "Gucci" };

  useEffect(() => {
    fetchMyCollection();
  }, []);

  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(item => brandsMap[item.brand_id] === activeTab);
      setFilteredProducts(filtered);
    }
  }, [activeTab, products]);

  const fetchMyCollection = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/collection`, {
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
      console.error("Error fetching collection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleListForSale = async () => {
    const token = localStorage.getItem("token");
    if (!selectedProduct) return;

    try {
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
      const tokenId = await nftContract.serialToTokenId(selectedProduct.serial); //
      if (tokenId === BigInt(0)) throw new Error("ไม่พบสินค้าชิ้นนี้บน Blockchain");

      // 4. ขั้นตอน Blockchain Step 1: Approve ให้ Escrow มีสิทธิ์ดึงของ
      alert("กรุณายืนยันการ Approve สินค้าใน MetaMask");
      const approveTx = await nftContract.approve(ESCROW_ADDRESS, tokenId);
      await approveTx.wait();

      // 5. ขั้นตอน Blockchain Step 2: สั่ง List ด้วย Serial (ตามที่คุณจะแก้ใน .sol)
      alert("กำลังนำสินค้าเข้าสู่ระบบ Escrow...");

     // แปลงราคาจากบาทเป็น Wei (หรือหน่วยที่ใช้ใน Contract)
      const priceInEth = ethers.parseUnits(selectedProduct.price.toString(), "ether"); 
      const listTx = await escrowContract.listProduct(tokenId, priceInEth);
      await listTx.wait();

      await fetch(`${API_BASE_URL}/${selectedProduct.id}/sellcollection`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      alert("Success: สินค้าของคุณถูกนำไปวางขายใน Marketplace แล้ว!");
      setIsModalOpen(false);
      fetchMyCollection();

    } catch (error) {
      console.error("Error listing product:", error);
      alert("เกิดข้อผิดพลาด: ไม่สามารถนำสินค้าลงขายได้");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-[#D4A017]" size={28} />
            <h1 className="text-3xl font-bold text-black uppercase tracking-tight">My Collection</h1>
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

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400 animate-pulse font-medium">
            Accessing your private vault...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
            <Package className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-medium">No items found in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between shadow-sm border border-gray-50 hover:shadow-md transition-all">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-16 h-16 bg-[#F3F3F3] rounded-2xl flex items-center justify-center font-serif font-black text-gray-300 text-xl border border-gray-100">
                    {brandsMap[item.brand_id]?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black leading-tight">{item.model}</h3>
                    <p className="text-gray-400 text-sm">by {brandsMap[item.brand_id]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 my-4 md:my-0">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Palette size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">{item.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-[#D4A017]" />
                    <span className="text-sm font-bold text-gray-900 tracking-wider">{item.serial}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <p className="text-xl font-bold text-black">{Number(item.price).toLocaleString()}ETH</p>
                  <button 
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsModalOpen(true);
                    }}
                    className="bg-[#D4A017] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95"
                  >
                    List for Sale
                  </button>
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
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Listing for sale</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-[0.2em] mb-3">Authentication Verified</p>
                <h4 className="font-bold text-xl text-black mb-1">{selectedProduct.model}</h4>
                <p className="text-gray-500 text-sm mb-5">{brandsMap[selectedProduct.brand_id]} — {selectedProduct.serial}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-400 uppercase font-black">Price</span>
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
                  onClick={handleListForSale}
                  className="py-4 rounded-2xl text-sm font-bold bg-[#D4A017] text-white hover:bg-black shadow-lg shadow-[#D4A017]/30 transition-all flex items-center justify-center gap-2"
                >
                  Confirm
                </button>
              </div>
            </div>
            <div className="bg-black p-3 flex items-center gap-2 justify-center">
              <AlertCircle size={14} className="text-[#D4A017]" />
              <p className="text-[11px] text-white font-medium">By listing this item, it will be moved to the public marketplace.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );            
}