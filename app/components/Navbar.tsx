"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const firstname = localStorage.getItem('firstname');
      const email = localStorage.getItem('email');
      
      if (token && role) {
        setIsLoggedIn(true);
        setUserRole(role.toLowerCase());
        setUserName(firstname);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName(null);
        setUserEmail(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const navLinks = [
    { name: 'Admin', href: '/Allpage/Admin', roles: ['admin'] },
    { name: 'Escrow', href: '/Allpage/Escrow', roles: ['user'] },
    { name: 'MyCollection', href: '/Allpage/MyCollection', roles: ['user'] },
    { name: 'Market', href: '/Allpage/Market', roles: ['admin', 'user'] },
    { name: 'Verify', href: '/Allpage/Verify', roles: ['admin', 'user'] },
    { name: 'Trading', href: '/Allpage/Trading', roles: ['admin', 'user'] },
    { name: 'Asset', href: '/Allpage/Asset', roles: ['user'] },
  ];

  const filteredLinks = navLinks.filter(link => 
    userRole && link.roles.includes(userRole)
  );

    const handleLogout = async () => {
        router.push('/login'); 
            setTimeout(() => {
          localStorage.clear(); 
          setIsLoggedIn(false);
          setUserRole(null);
              setUserName(null);
              setUserEmail(null);
            }, 100); 
      };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-bold tracking-tighter">
          <span className="text-[#E2AD28]">LUXE</span>
          <span className="text-black">CHAIN</span>
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        {isLoggedIn && filteredLinks.map((link) => {
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

      <div className="flex items-center space-x-6">
        {isLoggedIn ? (
          <>
            <div className="flex items-center space-x-3 border-r pr-6 border-gray-100">
              <div className="text-right">
                <p className="text-sm font-bold text-[#E2AD28] capitalize">
                  {userName || 'Guest User'}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  {userEmail || 'no-email@example.com'}
                </p>
              </div>
              
              <div className="relative group">
                <div className="flex items-center space-x-1 cursor-pointer">
                  <div className="w-10 h-10 rounded-full border border-[#E2AD28] flex items-center justify-center text-[#E2AD28] font-semibold text-lg bg-white uppercase">
                    {userRole === 'admin' ? 'A' : (userRole === 'user' ? 'U' : 'G')}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors font-medium text-base"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link 
            href="/login" 
            className="text-sm font-bold text-white bg-[#E2AD28] px-6 py-2 rounded-xl hover:bg-black transition-all"
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;