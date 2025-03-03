"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { login, getRedirectUrl } from "../services/authService";
import { useRouter } from "next/navigation"; // ✅ ใช้สำหรับ Redirect


const HomeNav = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState(""); // ✅ เก็บ Email
  const [password, setPassword] = useState(""); // ✅ เก็บ Password
  const [error, setError] = useState(""); // ✅ แสดง Error Message
  const router = useRouter(); // ✅ ใช้สำหรับ Redirect
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // เลื่อนแบบ Smooth
    }
  };

  const showLoginSidebar = () => {
    setShowLogin(true);
  };

  const hideLoginSidebar = () => {
    setShowLogin(false);
  };

    // ✅ ฟังก์ชัน Login
    const handleLogin = async () => {
      try {
          setError(""); // ✅ เคลียร์ Error ก่อน Login
          
          // ✅ เรียก API Login
          const { role, redirectUrl } = await login(email, password);
          
          console.log("🔄 Redirecting to:", redirectUrl);
  
          // ✅ เปลี่ยนเส้นทางไปยังหน้าที่เหมาะสมตาม Role
          router.push(redirectUrl);
  
      } catch (err: any) {
          console.error("❌ [Login Error]:", err.message);
          setError(err.message || "Login failed"); // ✅ แสดง Error Message
      }
  };
  
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`fixed w-full h-24 flex justify-between px-5 items-center text-white text-xl z-50 transition-all duration-300 ${hasScrolled ? "bg-[#3D405B] shadow-md" : "bg-transparent"
      }`} >
      <div className="flex justify-center items-center gap-4" >
        <a className="flex items-center gap-2">
          <img src="/images/LogoNoBgNotxt.png" alt="Logo" className="w-24 pt-3" />
          <div className="flex flex-col justify-center items-start">
            <p className="text-3xl font-bold">Purely</p>
            <small>TRACE</small>
          </div>
        </a>
      </div >
      <div className="hidden md:flex gap-10 justify-center items-center pr-10">
        <a href="/" className="hover:text-[#f2cc8f] active:text-[#f2cc8f] cursor-pointer" onClick={() => scrollToSection('home')}>Home</a>
        <a className="hover:text-[#f2cc8f] cursor-pointer" onClick={() => scrollToSection('about')}>About</a>
        <a className="hover:text-[#f2cc8f] cursor-pointer" onClick={() => scrollToSection('story')}>Story</a>
        <a className="hover:text-[#f2cc8f] cursor-pointer" onClick={() => scrollToSection('details')}>Details</a>
        <a className="hover:text-[#f2cc8f] cursor-pointer" onClick={() => scrollToSection('contact')}>Contact Us</a>
        <div className="flex flex-wrap m-2 items-center border-2 border-[#f2cc8f] rounded-full p-2 justify-center shadow-md">
          <a className="font-semibold px-3 text-[#f2cc8f] cursor-pointer" onClick={showLoginSidebar}>
            Sign In
          </a>
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 right-0 w-3/4 h-full bg-[#3D405B] shadow-lg flex flex-col p-5">
            <button onClick={toggleMobileMenu} className="self-end text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <a className="hover:text-[#f2cc8f] cursor-pointer mt-5" onClick={() => { scrollToSection('home'); toggleMobileMenu(); }}>Home</a>
            <a className="hover:text-[#f2cc8f] cursor-pointer mt-5" onClick={() => { scrollToSection('about'); toggleMobileMenu(); }}>About</a>
            <a className="hover:text-[#f2cc8f] cursor-pointer mt-5" onClick={() => { scrollToSection('story'); toggleMobileMenu(); }}>Story</a>
            <a className="hover:text-[#f2cc8f] cursor-pointer mt-5" onClick={() => { scrollToSection('details'); toggleMobileMenu(); }}>Details</a>
            <a className="hover:text-[#f2cc8f] cursor-pointer mt-5" onClick={() => { scrollToSection('contact'); toggleMobileMenu(); }}>Contact Us</a>
            <div className="flex flex-wrap m-2 items-center border-2 border-[#f2cc8f] rounded-full p-2 justify-center shadow-md mt-5">
              <a className="font-semibold px-3 text-[#f2cc8f] cursor-pointer" onClick={() => { showLoginSidebar(); toggleMobileMenu(); }}>
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}
      {/* Login SideBar */}
      {showLogin && (
        <div className="flex bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full justify-center items-center z-50" id="login">
          <div className="flex flex-col justify-between fixed top-0 right-0 w-full md:w-1/4 h-full bg-[#83b39b] shadow-lg">
          <div className="flex flex-col justify-center p-8">
    <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#3D405B]">Sign In</h1>
        <svg onClick={hideLoginSidebar} xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#3D405B] cursor-pointer" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </div>

    {/* ✅ แสดงข้อความ Error ถ้ามี */}
    {error && <p className="text-red-600">{error}</p>}

    <div className="flex flex-col gap-3 mt-5 text-[#3D405B]">
        <label className="text-xl mt-5">Email</label>
        <input type="email" className="rounded-full p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <label htmlFor="password" className="text-xl mt-3">Password</label>
        <input type="password" className="rounded-full p-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleLogin} className="bg-[#f2cc8f] text-white p-2 rounded-full mt-5 hover:bg-[#e0b97d]">
            Sign In
        </button>

        <Link href={'/SignUp'} className="text-center mt-3 cursor-pointer">
            Don't have an account?
        </Link>
    </div>
</div>

            <div className="flex flex-col justify-center items-start">
              <div className="flex flex-col gap-3 px-8">
                <p className="text-2xl font-bold">Any Questions?</p>
                <p className="text-2xl text-[#3D405B]">061-980-2102, 092-248-8797</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="bottom-0 scale-y-[-1] w-full">
                <path fill="#3D405B" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}
      {/* end login sidebar */}
    </div >
  );
};
export default HomeNav;