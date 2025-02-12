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
          <img src="./images/profile2.jpg" alt="profile" className="rounded-full w-12 h-12" />
          <p>Profile</p>
        </div>
      </div>
    </div>
  )
}
export default FarmerNavbar;