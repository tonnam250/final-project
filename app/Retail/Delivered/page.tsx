"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getRetailerTracking } from "@/services/trackingService";

const Delivered = () => {
    const [trackingData, setTrackingData] = useState<
        { trackingId?: string; moreInfoLink?: string }[]
    >([]);
    
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRetailerTracking();
                console.log("🔥 Debug - Retailer Tracking Data:", data);
                setTrackingData(data);
            } catch (error) {
                console.error("❌ Error fetching retailer tracking IDs:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-screen pt-20">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-semibold text-center">Delivered Order</h1>

                {/* Tracking Items */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {trackingData.length === 0 ? (
                        <p className="text-xl text-gray-500">No delivered orders found.</p>
                    ) : (
                        trackingData.map((item, index) => (
                            <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-auto gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                                <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                    {/* ✅ แสดง Tracking ID เฉพาะเมื่อมีค่า */}
                                    {item.trackingId && (
                                        <span className="text-xl md:text-2xl font-semibold">
                                            Tracking ID: <p className="font-normal inline">{item.trackingId}</p>
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-3">
                                    {/* ✅ ปุ่ม "More Info" */}
                                    {item.moreInfoLink && (
                                        <Link href={item.moreInfoLink} className="text-lg md:text-xl underline italic cursor-pointer">
                                            More info
                                        </Link>
                                    )}

                                    {/* ✅ ปุ่ม "รับ" ที่จะนำไปยังหน้า Recieving */}
                                    {item.trackingId && (
                                        <button
                                            className="bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] transition-all"
                                            onClick={() => router.push(`http://192.168.43.218:3000/Retail/Recieving?trackingId=${item.trackingId}`)}
                                        >
                                            รับ
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Delivered;
