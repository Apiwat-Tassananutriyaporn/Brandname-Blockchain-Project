"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // เพิ่มตัวนี้
import { ChevronDown } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname(); // ดึง path ปัจจุบัน

  const navLinks = [
    { name: 'Admin', href: '/Allpage/Admin' }, // ปรับตัวพิมพ์ใหญ่ให้ตรงกับชื่อโฟลเดอร์
    { name: 'Escrow', href: '/Allpage/Escrow' },
    { name: 'MyCollection', href: '/Allpage/MyCollection' },
    { name: 'Market', href: '/Allpage/Market' },
    { name: 'Verify', href: '/Allpage/Verify' },
    { name: 'Trading', href: '/Allpage/Trading' },
    { name: 'Asset', href: '/Allpage/Asset' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tighter">
          <span className="text-[#E2AD28]">LUXE</span>
          <span className="text-black">CHAIN</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-8">
        {navLinks.map((link) => {
          // เช็คว่า path ปัจจุบันตรงกับเมนูนี้หรือไม่
          const isActive = pathname.startsWith(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive 
                  ? 'text-[#E2AD28] bg-orange-50 px-3 py-1 rounded-md' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <p className="text-sm font-bold text-[#E2AD28]">Somsak Luxury</p>
          <p className="text-xs text-gray-400 font-mono">12,550.00 USDT</p>
        </div>
        
        <div className="flex items-center space-x-1 cursor-pointer group">
          <div className="w-10 h-10 rounded-full border border-[#E2AD28] flex items-center justify-center text-[#E2AD28] font-semibold text-lg bg-white">
            S
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:text-black transition-colors" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;