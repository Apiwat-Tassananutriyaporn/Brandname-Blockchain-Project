"use client";
import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import {ethers} from 'ethers';
import { useSearchParams } from 'next/dist/client/components/navigation';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, name: 'Listing', icon: Lock },
  { id: 2, name: 'Payment', icon: ShieldCheck },
  { id: 3, name: 'Verification', icon: CheckCircle2 },
  { id: 4, name: 'Atomic Swap', icon: Sparkles },
];

const ESCROW_ABI = [
  "function buy(uint256 tokenId) external payable",
  "function confirm(uint256 tokenId) external",
  "function swap(uint256 tokenId) external",
  "function listings(uint256) public view returns (address seller, address buyer, uint256 price, bool confirmed, bool active)"
];

const NFT_ABI = [
  "function serialToTokenId(string memory serial) public view returns (uint256)"
];

const ESCROW_ADDRESS = "0xFe96a382831b84992643886791c8eD872fD0AA8F";
const NFT_ADDRESS = "0x8a868F9dF8162c13731e38589a3d8Cd7cBBc6E26";

export default function EscrowPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const owner_id = searchParams.get('owner_id');
  const serial = searchParams.get('serial');
  const priceInEth = searchParams.get('price'); // ราคาจาก URL
  const token_id = searchParams.get('token_id'); // token_id จาก URL
  const [currentStep, setCurrentStep] = useState(1);
  const [ethPrice, setEthPrice] = useState(priceInEth || "0");

  console.log("Serial from URL:", serial);

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  // ฟังก์ชันช่วยดึง TokenId จาก Serial
  const getTokenId = async (signer: any) => {
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
    const id = await nftContract.serialToTokenId(serial);
    if (id === BigInt(0)) throw new Error("ไม่พบสินค้าบน Blockchain");
    return id;
  };
  console.log("tokenId:", getTokenId);

  //  Step 2: Payment (เรียกฟังก์ชัน buy)
  const handlePayment = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenId = await getTokenId(signer);
      const contract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);

      // เรียกฟังก์ชัน buy พร้อมส่งเงิน [cite: 25, 26, 27]
      const tx = await contract.buy(tokenId, { 
        value: ethers.parseEther(priceInEth || "0") 
      });
      await tx.wait();
      nextStep();
    } catch (error: any) { alert(error.message); }
  };

  //  Step 3: Verification (เรียกฟังก์ชัน confirm)
  const handleConfirm = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenId = await getTokenId(signer);
      const contract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);

      const tx = await contract.confirm(tokenId); // 
      await tx.wait();
      nextStep();
    } catch (error: any) { alert(error.message); }
  };

  //  Step 4: Atomic Swap (เรียกฟังก์ชัน swap)
  const handleSwap = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenId = await getTokenId(signer);
      const contract = new ethers.Contract(ESCROW_ADDRESS, ESCROW_ABI, signer);

      const tx = await contract.swap(tokenId); // [cite: 29, 30]
      await tx.wait();

      alert("test")

      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/product/${id}/buycollection`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      alert("โอนกรรมสิทธิ์และชำระเงินสำเร็จ!");
    } catch (error: any) { alert(error.message); }

    router.push('/Allpage/MyCollection');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#4A4A4A] font-serif">
      {/* Header Section */}
      <div className="pt-16 pb-10 text-center">
        <h1 className="text-4xl font-semibold text-[#1A1A1A] mb-2">Escrow System</h1>
        <p className="text-gray-500 italic">Secure step-by-step ownership transfer</p>
      </div>

      {/* Progress Bar Area - แก้ไขจุดนี้เพื่อให้เส้นสีทองแตะขอบวงกลมพอดี */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive 
                      ? 'bg-[#D4A744] border-[#D4A744] text-white shadow-md shadow-[#D4A744]/20' 
                      : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`absolute -bottom-7 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'text-[#D4A744]' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                </div>

                {/* Connector Line (สร้างเส้นระหว่างช่อง) */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-[2px] bg-gray-200 mx-2 relative overflow-hidden">
                    {/* Active Gold Line */}
                    <div 
                      className={`absolute top-0 left-0 h-full bg-[#D4A744] transition-all duration-700 ease-in-out ${
                        isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Card Content */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100 transition-all">
          
          {/* Step 1: Listing */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="inline-flex p-5 rounded-full bg-[#D4A744]/10 text-[#D4A744]">
                <Lock size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Listing</h2>
              <p className="text-xl text-gray-600">Asset locked in escrow smart contract</p>
              <p className="text-gray-400">NFT ownership rights are being transferred to the escrow contract...</p>
              <button onClick={nextStep} className="mt-8 px-12 py-3 bg-[#D4A744] hover:bg-[#B38C36] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#D4A744]/30">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="inline-flex p-5 rounded-full bg-[#D4A744]/10 text-[#D4A744]">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Payment</h2>
              <p className="text-xl text-gray-600">Funds secured in safe contract</p>
              <div className="py-4">
                <span className="text-4xl font-bold text-[#D4A744]">{ethPrice} ETH</span>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Secured in Safe Smart Contract</p>
              </div>
              <button onClick={handlePayment} className="mt-4 px-12 py-3 bg-[#D4A744] hover:bg-[#B38C36] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#D4A744]/30">
                Continue
              </button>
            </div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="inline-flex p-5 rounded-full bg-[#D4A744]/10 text-[#D4A744]">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Verification</h2>
              <p className="text-xl text-gray-600">Buyer confirms digital identity</p>
              <p className="text-gray-400 italic">Please verify that the digital identity matches the physical asset</p>
              <button onClick={handleConfirm} className="mt-8 px-12 py-3 bg-[#D4A744] hover:bg-[#B38C36] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#D4A744]/30">
                Confirm Received
              </button>
            </div>
          )}

          {/* Step 4: Atomic Swap */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="inline-flex p-5 rounded-full bg-[#D4A744]/10 text-[#D4A744]">
                <Sparkles size={48} />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Atomic Swap</h2>
              <p className="text-xl text-gray-600">Simultaneous exchange completed</p>
              <p className="text-gray-400">Executing atomic swap — funds and NFT exchange simultaneously</p>
              <button onClick={handleSwap} className="mt-8 px-12 py-3 bg-[#D4A744] hover:bg-[#B38C36] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#D4A744]/30">
                Execute Swap
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}