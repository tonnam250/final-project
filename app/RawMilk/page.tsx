import React from "react";
import Link from 'next/link';

const RawMilk = async () => {

  const res = await fetch('http://localhost:3000/data/RMdata.json');
  const data = await res.json();

  return (
    <div className="flex flex-col w-full h-full min-h-screen">
      <div className="flex flex-col justify-center items-center w-full h-[40vh]">
        <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-full mt-10">
        <h1 className="text-6xl font-semibold">Raw Milk</h1>
        <div className="flex justify-center items-center w-full h-full gap-5 mt-10">
          <input type="search" name="search" id="search" placeholder="Search..." className="p-3 border-2 rounded-full w-1/3 text-xl" />
          <Link href={'/CreateRM'} className="bg-[#5E929E] text-white font-semibold p-3 w-24 text-xl rounded-full text-center">+ Add</Link>
        </div>

        {/* Raw milk item */}
        <div className="flex flex-col justify-center items-center w-full h-full mt-10 gap-8">
          {data.map((tank: { tankNo: string, status: string, personInCharge: string }, index: number) => (
            <div key={index} className="flex flex-col justify-center items-center w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl">
              <div className="flex justify-between items-center w-full h-1/2 p-5">
                <span className="text-2xl font-semibold">Milk Tank no: <p className="font-normal inline">{tank.tankNo}</p></span>
                <div className="flex gap-2 text-center items-center rounded-xl text-xl text-[#198755] bg-[#d1e7dd] px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                  </svg>
                  <p className="font-semibold">
                    {tank.status}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full h-1/2 p-5">
                <span className="text-2xl font-semibold">Person In Charge: <p className="inline font-normal">{tank.personInCharge}</p></span>
                <a className="text-xl underline italic cursor-pointer">More info</a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* end Raw Milk Item */}
    </div>
  );
}
export default RawMilk;