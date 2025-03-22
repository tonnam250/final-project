"use client";

// app/layout.tsx
import { redirect, usePathname, useRouter } from 'next/navigation';
import HomeNav from '../components/HomeNav';
import FarmerNavbar from '../components/FarmerNavbar';
import FactoryNavbar from '../components/FactoryNav';
import LogisNav from '../components/LogisNav';
import RetailNav from '../components/RetailNav';
import './globals.css'; // Ensure the correct path to the CSS file
import { Raleway } from 'next/font/google';
import { useEffect } from 'react';
import axios from 'axios';

const raleway = Raleway({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().toLowerCase();
  const router = useRouter();

  // const getUserRole = async () => {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     redirect('/');
  //   }

  //   try {
  //     const res = await axios.get('/user/me', {
  //       baseURL: process.env.NEXT_PUBLIC_API_URL,
  //       headers: { Authorization: `Bearer ${token}`}
  //     })
  //   }
  // }

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (!token && !['/', '/signup'].includes(pathname)) {
  //     redirect('/')  // Redirect to login if not authenticated
  //   } else {

  //   }
  // }, [pathname, router])

  let navbar = null;
  if (pathname === '/' || pathname.startsWith('/signup') || pathname.startsWith('/tracking')) {
    navbar = <HomeNav />;
  } else if (pathname.startsWith('/farmer')) {
    navbar = <FarmerNavbar />;
  } else if (pathname.startsWith('/factory')) {
    navbar = <FactoryNavbar />;
  } else if (pathname.startsWith('/logistic')) {
    navbar = <LogisNav />;
  } else if (pathname.startsWith('/retailer')) {
    navbar = <RetailNav />;
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
