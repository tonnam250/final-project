"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFarmRawMilkTanks } from "@/services/rawMilkService";

const FarmRawMilk = () => {
  const [milkTanks, setMilkTanks] = useState<
    { tankId: string; personInCharge: string; status: string; id: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFarmRawMilkTanks();
        console.log("🔥 Debug - MilkTanks:", data); // ✅ Debug ว่ามีค่าจริงหรือไม่
        setMilkTanks(data);
      } catch (error) {
        console.error("❌ Error fetching milk tanks:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  const filteredMilkTanks = searchQuery.trim()
  ? milkTanks.filter((tank) =>
      tank.milkTankInfo.tankId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : milkTanks;

  
  console.log("🔥 Debug - Filtered Milk Tanks:", filteredMilkTanks);


  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      <div className="flex flex-col justify-center items-center w-full h-[40vh]">
        <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
        <h1 className="text-4xl md:text-6xl font-bold">Raw Milk</h1>
        <div className="flex justify-center items-center w-full h-full gap-5 mt-10 px-8">
          <div className="relative w-1/2">
            <input type="search" name="search" id="search" placeholder="Search..." className="p-3 border-2 rounded-full w-full text-xl pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-6">
              <path fill="currentColor" fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06zM10.5 7a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0" clipRule="evenodd" />
            </svg>
          </div>
          <Link href={'/Farmer/FarmCreateRM'} className="bg-[#5E929E] text-white font-semibold p-3 w-fit text-xl rounded-full text-center">+ Add</Link>
        </div>

        {/* Raw milk item */}
        <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
          
          {filteredMilkTanks.map((item: { tankId: string, personInCharge: string, status: string, id: string }, index: number) => (
            <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
              <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                <span className="text-xl md:text-2xl font-semibold">Milk Tank no: <p className="font-normal inline">{item.milkTankInfo.tankId.slice(-3)}</p></span>
                <div className={`flex gap-2 text-center items-center rounded-xl text-lg md:text-xl ${item.status.toLowerCase() === 'pending' ? 'text-[#ffc107] bg-[#fff3cd]' : item.status.toLowerCase() === 'received' ? 'text-[#198755] bg-[#d1e7dd]' : ''} px-2 py-1 mt-2 md:mt-0`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                  </svg>
                  <p className="font-semibold">
                    {item.status}
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                <span className="text-xl md:text-2xl font-semibold">Person In Charge: <p className="inline font-normal">{item.milkTankInfo.personInCharge}</p></span>
                <Link href={`/Farmer/FarmDetails?id=${item.id}`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">More info</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* end Raw Milk Item */}
    </div>
  );
}
export default FarmRawMilk;