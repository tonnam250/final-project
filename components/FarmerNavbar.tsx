"use client";
import Link from "next/link"
import { usePathname } from "next/navigation";

const FarmerNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex px-8 h-22 w-full bg-[#D3D596] items-center text-[#52600A] text-2xl font-semibold fixed z-10">

      <div className="flex justify-start items-center gap-4 w-1/2">
        <a href="/" className="flex items-center gap-2">
          <div className="overflow-hidden w-20 h-20">
            <img src="/images/LogoNoBgNotxt.png" alt="Logo" />
          </div>
          <div className="flex flex-col justify-center items-start">
            <p className="text-3xl font-bold">Purely</p>
            <small className="text-lg font-semibold">TRACE</small>
          </div>
        </a>
      </div>

      <div className="flex gap-24 justify-end items-center w-1/2">

        <Link href={'/FarmGeneralInfo'} className={`hover:text-[#7B9B9E] ${pathname === "/FarmGeneralInfo" ? "text-[#7B9B9E]" : ""}`}>General information</Link>
        <Link href={'/RawMilk'} className={`hover:text-[#7B9B9E] ${pathname === "/RawMilk" ? "text-[#7B9B9E]" : ""}`}>Raw Milk</Link>

        <div className="flex flex-wrap m-2 items-center border-2 border-[#EFE4DC] rounded-full px-3 py-2 justify-center shadow-md gap-3 cursor-pointer hover:text-[#7B9B9E] hover:bg-[#E1EABB]">
          <div className="flex flex-wrap w-12 h-12 bg-slate-200 rounded-full">
            {/* <img src="./images/profile2.jpg" alt="profile" className="rounded-full w-12 h-12" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24">
              <path fill="#999999"  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4" />
            </svg>
          </div>
          <p>Profile</p>
        </div>
      </div>
    </div>
  )
}
export default FarmerNavbar;