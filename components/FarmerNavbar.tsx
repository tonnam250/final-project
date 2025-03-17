"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FarmerNavbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-8 h-18 w-full bg-[#D3D596] items-center text-[#52600A] text-xl md:text-2xl font-semibold fixed z-10">
      <div className="flex justify-between items-center w-full md:w-1/2">
        <a href="/" className="flex items-center gap-2">
          <div className="overflow-hidden w-12 md:w-20 h-12 md:h-20">
            <img src="/images/LogoNoBgNotxt.png" alt="Logo" />
          </div>
          <div className="flex flex-col justify-center items-start">
            <p className="text-2xl md:text-3xl font-bold">Purely</p>
            <small className="text-base md:text-lg font-semibold">TRACE</small>
          </div>
        </a>
        <button className="md:hidden" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#52600A" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" />
          </svg>
        </button>
      </div>

      <div className={`flex-col md:flex-row md:flex gap-4 md:gap-24 justify-end items-center w-full md:w-1/2 ${isMenuOpen ? 'flex' : 'hidden'} md:flex`}>
        <Link href={'/Farmer/GeneralInfo'} className={`hover:text-[#7B9B9E] ${pathname === "/Farmer/FarmGeneralInfo" ? "text-[#7B9B9E]" : ""}`}>General Information</Link>
        <Link href={'/Farmer/FarmRawMilk'} className={`hover:text-[#7B9B9E] ${pathname === "/Farmer/FarmRawMilk" ? "text-[#7B9B9E]" : ""}`}>Raw Milk</Link>
        {/* Profile section moved to the top only when menu is collapsed on medium devices */}
        <Link href={'/Farmer/Profile'} className={`flex flex-wrap m-2 items-center border-2 border-[#EFE4DC] rounded-full px-2 md:px-3 py-1 md:py-2 justify-center shadow-md gap-2 md:gap-3 cursor-pointer hover:text-[#7B9B9E] hover:bg-[#E1EABB] ${isMenuOpen ? 'order-first' : ''}`}>
          <div className="flex flex-wrap w-8 md:w-10 h-8 md:h-10 bg-slate-200 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 md:w-10 h-8 md:h-10" viewBox="0 0 24 24">
              <path fill="#999999" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
            </svg>
          </div>
          <p className="text-base md:text-lg">Profile</p>
        </Link>
      </div>
    </div>
  );
};

export default FarmerNavbar;