"use client";

<<<<<<< Updated upstream
// app/layout.tsx
import { usePathname } from 'next/navigation';
import HomeNav from '../components/HomeNav';
import FarmerNavbar from '../components/FarmerNavbar';
import './globals.css'; // Ensure the correct path to the CSS file
import { Raleway } from 'next/font/google';
=======
import { usePathname } from "next/navigation";
import HomeNav from "../components/HomeNav";
import FarmerNavbar from "../components/FarmerNavbar";
import FactoryNavbar from "../components/FactoryNav";
import "./globals.css"; // ✅ ตรวจสอบ path ว่าอยู่ถูกที่
import { Raleway } from "next/font/google";
>>>>>>> Stashed changes

const raleway = Raleway({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
<<<<<<< Updated upstream
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        {pathname === '/' ? <HomeNav /> : <FarmerNavbar />}
=======
  const pathname = usePathname().toLowerCase();

  // ✅ เช็ค Navbar ตาม path
  let navbar = <HomeNav />; // ✅ ตั้งค่า Default Navbar

  if (pathname.startsWith("/farmer")) {
    navbar = <FarmerNavbar />;
  } else if (pathname.startsWith("/factory")) {
    navbar = <FactoryNavbar />;
  }

  return (
    <html lang="en">
      <head>
        <title>Purely Trace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={raleway.className}>
        {navbar}
>>>>>>> Stashed changes
        {children}
      </body>
    </html>
  );
}
