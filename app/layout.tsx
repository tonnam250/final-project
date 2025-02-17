"use client";

// app/layout.tsx
import { usePathname } from 'next/navigation';
import HomeNav from '../components/HomeNav';
import FarmerNavbar from '../components/FarmerNavbar';
import FactoryNavbar from '../components/FactoryNav';
import './globals.css'; // Ensure the correct path to the CSS file
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().toLowerCase();

  let navbar = null;
  if (pathname === '/') {
    navbar = <HomeNav />;
  } else if (pathname.startsWith('/farmer')) {
    navbar = <FarmerNavbar />;
  } else if (pathname.startsWith('/factory')) {
    navbar = <FactoryNavbar />;
  }

  return (
    <html lang="en">
      <body>
        {navbar}
        {children}
      </body>
    </html>
  );
}
