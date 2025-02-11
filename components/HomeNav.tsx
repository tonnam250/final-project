import Link from "next/link";
import { useState, useEffect } from "react";

const HomeNav = () => {
    const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setHasScrolled(false); // ทำให้ Navbar เป็น transparent
      } else {
        setHasScrolled(true); // ใส่ Background ให้ Navbar
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

        return (
            <div className={`fixed w-full h-24 flex justify-between px-5 items-center text-white text-xl z-50 transition-all duration-300 ${hasScrolled ? "bg-[#3D405B] shadow-md" : "bg-transparent"
                }`} >
                <div className="flex justify-center items-center gap-4" >
                    <a href="/" className="flex items-center gap-2">
                        <img src="./images/LogoNoBgNotxt.png" alt="Logo" className="w-24 pt-3" />
                        <div className="flex flex-col justify-center items-start">
                            <p className="text-3xl font-bold">Purely</p>
                            <small>TRACE</small>
                        </div>
                    </a>
                </div >
                <div className="flex gap-10 justify-center items-center pr-10">
                    <Link href={'#home'} className="hover:text-[#f2cc8f] active:text-[#f2cc8f]">Home</Link>
                    <a href="#about" className="hover:text-[#f2cc8f]">About</a>
                    <a href="#story" className="hover:text-[#f2cc8f]">Story</a>
                    <a href="#details" className="hover:text-[#f2cc8f]">Details</a>
                    <a href="contact" className="hover:text-[#f2cc8f]">Contact Us</a>
                    <div className="flex flex-wrap m-2 items-center border-2 border-[#f2cc8f] rounded-full p-2 justify-center shadow-md">
                        <Link href={'Login'} className="font-semibold px-3 text-[#f2cc8f]">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div >
        );
    };
    export default HomeNav;