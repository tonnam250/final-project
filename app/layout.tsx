"use client";

// app/layout.tsx
import { usePathname } from 'next/navigation';
import HomeNav from '../components/HomeNav';
import FarmerNavbar from '../components/FarmerNavbar';
import './globals.css'; // Ensure the correct path to the CSS file
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        {pathname === '/' ? <HomeNav /> : <FarmerNavbar />}
        {children}
      </body>
    </html>
  );
}
