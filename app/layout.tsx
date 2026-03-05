// layout.tsx
"use client";

import "./globals.css";
import { usePathname } from 'next/navigation';
import Navbar from "../app/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // เพิ่ม "/" เข้าไปเพื่อให้หน้าแรกไม่แสดง Navbar ด้วย
  const noNavbarPages = ["/", "/register", "/login"]; 
  
  const showNavbar = !noNavbarPages.includes(pathname);

  return (
    <html lang="en">
      <body className="antialiased bg-white"> 
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}