"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFactoryProductLots } from "@/services/productlotService";  // ใช้ Service ที่แก้ไขแล้ว

const ProductLot = () => {
    const [data, setData] = useState<any[]>([]);  // ตั้งค่า default เป็น array เปล่า

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchFactoryProductLots();  // ใช้ fetchFactoryProductLots
                setData(result);  // ตั้งค่าให้ data เป็นผลลัพธ์จาก Service
            } catch (error) {
                console.error("❌ Error fetching product lots:", error);
            }
        };

        fetchData();
    }, []);  // ทำงานแค่ตอนที่ component ถูก mount ครั้งแรก

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-20">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold text-center">Product Lot</h1>
                <div className="flex flex-col md:flex-row justify-center items-center w-full h-full gap-5 mt-10 px-8">
                    <Link href={'/Factory/ProductLot/AddProductLot'} className="bg-[#5E929E] text-white font-semibold p-3 w-full md:w-fit text-xl rounded-full text-center">+ Add</Link>
                </div>

                {/* Product lot item */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {data.map((item: { productLot: string, name: string, personInCharge: string, status: string }, index: number) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                <span className="text-xl md:text-2xl font-semibold">Product Lot no: <p className="font-normal inline">{item.productLotNo}</p></span>
                                <div className={`flex gap-2 text-center items-center rounded-xl text-lg md:text-xl 
                                    ${item.status?.toLowerCase() === 'ready' ? 'text-[#198755] bg-[#d1e7dd]' 
                                    : item.status?.toLowerCase() === 'empty' ? 'text-[#ffc107] bg-[#fff3cd]' 
                                    : 'text-[#6c757d] bg-[#e9ecef]'} px-2 py-1 mt-2 md:mt-0`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path fill="currentColor" fillRule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" />
                                    </svg>
                                    <p className="font-semibold">
                                        {item.status || 'Pending'} {/* แสดง 'Pending' ถ้าไม่มี status */}
                                    </p>
                                </div>

                            </div>
                            <div className='flex flex-col justify-center items-start w-full h-1/2'>
                                <span className="text-xl md:text-2xl font-semibold">Product Name: <p className="inline font-normal">{item.productName}</p></span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                <span className="text-xl md:text-2xl font-semibold">Person In Charge: <p className="inline font-normal">Person {index + 1}</p></span>
                                <Link href={`/Factory/ProductLot/Details`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">More info</Link>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
            {/* end Product Lot Item */}
        </div>
    );
};

export default ProductLot;
