"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getTrackingDetails, TrackingResponse, FarmData } from "@/services/trackService";

import FarmSeemore from "@/components/FarmSeemore";
import LogisSeemore from "@/components/LogisSeemore";
import RetailerSeemore from "@/components/RetailerSeemore";
import FactorySeemore from "@/components/FactorySeemore";

const TrackingPage = () => {
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");

    const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
    const [isLogisModalOpen, setIsLogisModalOpen] = useState(false);
    const [isRetailerModalOpen, setIsRetailerModalOpen] = useState(false);
    const [isFactoryModalOpen, setIsFactoryModalOpen] = useState(false);

    const [trackingData, setTrackingData] = useState<TrackingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RetailerData | null>(null);
    const [selectedFarm, setSelectedFarm] = useState<FarmData["farms"][0] | null>(null);

    

    const fetchTrackingData = useCallback(async () => {
        if (!trackingId) return;

        try {
            const data = await getTrackingDetails(trackingId as string);
            console.log("📌 Debug - trackingData from API:", data);
            setTrackingData(data);
            if (data) {
                localStorage.setItem("trackingData", JSON.stringify(data));
            }
        } catch (err) {
            console.error("Failed to load tracking data:", err);
        } finally {
            setLoading(false);
        }
    }, [trackingId]);

    useEffect(() => {
        fetchTrackingData();
    }, [fetchTrackingData]);

    useEffect(() => {
        if (!trackingData) {
            const storedData = localStorage.getItem("trackingData");
            console.log("📌 Debug - trackingData in RetailerSeemore:", storedData);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setData(parsedData?.retailer || null);
            }
        }
    }, [trackingData]);
    
    return (
        <div className="flex flex-col w-full h-full min-h-screen pt-24 items-center justify-center">
            <div className="flex w-full h-20 justify-center items-center">
                <h1 className="text-5xl text-center font-bold">
                    Tracking Your Journey
                </h1>
            </div>
            <div className="flex w-full h-full justify-center items-center gap-10 px-4 sm:px-0 bg-[url('/images/TracingBg_0.png')] bg-cover bg-center">
                <img src="/images/TrackingRoute3NoBg.png" alt="image_background" className="w-full" />
            </div>

            <div className="flex flex-col w-full h-full justify-center items-center">
                {/* Farm Section */}
            <div className="flex flex-col sm:flex-row w-full h-auto sm:h-40 justify-center sm:pl-40 lg:pl-96 pr-5 border-t border-gray-300">
                <div className="flex flex-col w-full sm:w-1/6 bg-[#fdeda8] border-b border-r border-gray-300 items-center justify-center text-center p-4">
                    <h1 className="text-xl sm:text-2xl">Farm</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M136.83 220.43a8 8 0 0 1-11.09 2.23A183.15 183.15 0 0 0 24 192a8 8 0 0 1 0-16a199.1 199.1 0 0 1 110.6 33.34a8 8 0 0 1 2.23 11.09M24 144a8 8 0 0 0 0 16a214.8 214.8 0 0 1 151.17 61.71a8 8 0 1 0 11.2-11.42A230.7 230.7 0 0 0 24 144m208 16a216.5 216.5 0 0 0-48.59 5.49q8.24 6.25 16 13.16A201.5 201.5 0 0 1 232 176a8 8 0 0 1 0 16c-6 0-11.93.29-17.85.86q8.32 8.67 15.94 18.14a8 8 0 1 1-12.48 10A247 247 0 0 0 24 128a8 8 0 0 1 0-16a265.4 265.4 0 0 1 48 4.38V80a8 8 0 0 1 3.2-6.4l64-48a8 8 0 0 1 9.6 0l64 48A8 8 0 0 1 216 80v32.5c5.31-.32 10.64-.5 16-.5a8 8 0 0 1 0 16a246.3 246.3 0 0 0-84.26 14.69q9.44 5 18.46 10.78A232.2 232.2 0 0 1 232 144a8 8 0 0 1 0 16" />
                    </svg>
                </div>

                {/* Farms List - Scrollable */}
                <div className="flex flex-col sm:flex-row w-full h-full bg-slate-100 border-b border-gray-300 overflow-x-auto">
                    <div className="flex flex-row w-max h-max">
                        {trackingData?.farm?.farms.map((farm, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:w-96 h-full border-r border-gray-300">
                                <div className="flex flex-col w-full sm:w-1/2 h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl">
                                    <span className="font-semibold">Farm Name: <p className="font-normal">{farm.companyName}</p></span>
                                    <button
                                        className="underline italic"
                                        onClick={() => {
                                            setSelectedFarm(farm);
                                            setIsFarmModalOpen(true);
                                        }}
                                    >
                                        See more
                                    </button>
                                </div>
                                <div className="flex flex-col w-full sm:w-1/2 h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl">
                                    <span className="font-semibold">Address: <p className="font-normal">{farm.address}, {farm.subDistrict}, {farm.district}, {farm.province}</p></span>
                                    <span className="font-semibold">Contact: <p className="font-normal">{farm.telephone}</p></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Farm Modal */}
            {selectedFarm && (
                <FarmSeemore
                    isOpen={isFarmModalOpen}
                    onClose={() => setIsFarmModalOpen(true)}
                    farm={selectedFarm}
                />
            )}
            </div>

            {/* Factory */}
            <div className="flex flex-col sm:flex-row w-full h-full sm:h-52 justify-center sm:pl-40 lg:pl-96 pr-5">
                <div className="flex flex-col w-full h-full sm:w-1/6 bg-[#fdeda8] border-b border-r border-gray-300 items-center justify-center text-center p-4">
                    <h1 className="text-xl sm:text-2xl">Factory</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4 22q-.825 0-1.412-.587T2 20v-8.7q0-.6.325-1.1t.9-.75L7.6 7.6q.5-.2.95.075T9 8.5V9l3.625-1.45q.5-.2.937.1t.438.825V10h8v10q0 .825-.587 1.413T20 22zm7-4h2v-4h-2zm-4 0h2v-4H7zm8 0h2v-4h-2zm6.8-9.5h-4.625l.725-5.625q.05-.375.338-.625T18.9 2h1.225q.375 0 .65.25t.325.625z" />
                    </svg>
                </div>

                {/* ✅ ทำให้กล่องข้อมูลทั้งหมดเลื่อนพร้อมกัน */}
                <div className="flex flex-row w-full h-full bg-slate-100 overflow-auto">
                    <div className="flex w-full sm:w-96 lg:border-b border-gray-300 border-r">
                        <div className="flex flex-col w-full sm:w-1/2 h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl">
                            <span className="font-semibold">Factory Name:<span className="inline font-normal"> {trackingData?.factory?.factoryInfo?.companyName || "N/A"}</span></span>
                            <span className="font-semibold">Product Lot:<span className="inline font-normal"> {trackingData?.factory?.GeneralInfo?.productId || "N/A"}</span></span>
                            <span className="font-semibold">Address:<span className="inline font-normal"> {trackingData?.factory?.factoryInfo?.address || "N/A"}</span></span>
                            <span className="font-semibold">Contact:<span className="inline font-normal"> {trackingData?.factory?.factoryInfo?.email || "N/A"}</span></span>
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2 h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl">
                            <span className="font-semibold">Quality</span>
                            <span className="font-semibold">pH:<span className="inline font-normal"> {trackingData?.factory?.nutrition?.pH || "N/A"}</span></span>
                            <span className="font-semibold">Temperature:<span className="inline font-normal"> {trackingData?.factory?.nutrition?.temp || "N/A"}°{trackingData?.factory?.nutrition?.tempUnit || ""}</span></span>
                            <span className="font-semibold">Protein:<span className="inline font-normal"> {trackingData?.factory?.nutrition?.protein || "N/A"}g</span></span>
                            <span className="font-semibold">Fat:<span className="inline font-normal"> {trackingData?.factory?.nutrition?.fat || "N/A"}g</span></span>

                            {/* ปุ่มดูเพิ่มเติม */}
                            <button 
                            onClick={() => setIsFactoryModalOpen(true)} 
                            className="mt-3 p-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                        >
                            ดูเพิ่มเติม
                        </button>
                        </div>
                    </div>
                </div>
            </div>





            {/* 📌 Logistics Section */}
            {trackingData?.logistics && (
                <div className="flex flex-col sm:flex-row w-full h-auto justify-center sm:pl-40 lg:pl-96 pr-5">
                    <div className="flex flex-col w-full sm:w-1/6 bg-[#fdeda8] border-r border-b border-gray-300 items-center justify-center text-center p-4">
                        <h1 className="text-xl sm:text-2xl">Logistics</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13 4a1 1 0 0 1 1 1h4a1 1 0 0 1 .783.378l.074.108l3 5l.055.103l.04.107l.029.109l.016.11L22 11v6a1 1 0 0 1-1 1h-1.171a3.001 3.001 0 0 1-5.658 0H9.829a3.001 3.001 0 0 1-5.658 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2zM7 16a1 1 0 1 0 0 2a1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2m.434-9H14v3h5.234z" />
                        </svg>
                    </div>

                    <div className="flex flex-col w-full bg-slate-100 border-gray-300 border-b overflow-x-auto">
                        {["beforeCheckpoints", "duringCheckpoints", "afterCheckpoints"].map((stage, index) => {
                            const checkpoints = trackingData.logistics?.[stage] || [];

                            return (
                                <div key={index} className="flex flex-col w-full h-full border-gray-300 p-4">
                                    <p className="font-semibold text-xl sm:text-2xl bg-[#ff9a00] w-fit p-2 rounded-xl text-white">
                                        {stage.replace("Checkpoints", "")}
                                    </p>

                                    {checkpoints.length > 0 ? (
                                        checkpoints.map((checkpoint: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="flex flex-col w-full h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl border-b border-gray-300"
                                            >
                                                <span className="font-semibold">
                                                    Company Name: <p className="inline font-normal">{checkpoint.receiverInfo?.companyName || "-"}</p>
                                                </span>
                                                <span className="font-semibold">
                                                    Person in charge: <p className="inline font-normal">{checkpoint.personInCharge || "-"}</p>
                                                </span>
                                                <span className="font-semibold">
                                                    Pickup Time: <p className="inline font-normal">
                                                        {checkpoint.pickupTime ? new Date(checkpoint.pickupTime * 1000).toLocaleString() : "-"}
                                                    </p>
                                                </span>
                                                <span className="font-semibold">
                                                    Delivery Time: <p className="inline font-normal">
                                                        {checkpoint.deliveryTime ? new Date(checkpoint.deliveryTime * 1000).toLocaleString() : "-"}
                                                    </p>
                                                </span>
                                                <span className="font-semibold">
                                                    Temperature: <p className="inline font-normal">{checkpoint.temperature || "-"}°C</p>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic text-center py-2">No Data Available</p>
                                    )}
                                </div>
                            );
                        })}

                        <button
                            className="underline italic text-xl text-blue-600 hover:text-blue-800 transition"
                            onClick={() => setIsLogisModalOpen(true)}
                        >
                            See more
                        </button>
                    </div>
                </div>
            )}

            {/* Retailer */}
            {trackingData?.retailer && (
                <div className="flex flex-col sm:flex-row w-full h-auto justify-center sm:pl-40 lg:pl-96 pr-5 ">
                    <div className="flex flex-col w-full sm:w-1/6 bg-[#fdeda8] border-r border-b border-gray-300 items-center justify-center text-center p-4">
                        <h1 className="text-xl sm:text-2xl">Retailer</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-14 sm:h-14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.5 11.5v-2h9v2zM4 3a2 2 0 0 0-1 3.732V20.25c0 .414.336.75.75.75H6v-5.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75V21h8.75a.75.75 0 0 0 .75-.75V6.732A2 2 0 0 0 20 3zm-.5 2a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5m3.25 3h10.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-3.5A.75.75 0 0 1 6.75 8m8 7h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75M10 16.5V21H7.5v-4.5z" />
                        </svg>
                    </div>
                    <div className="flex flex-col w-full bg-slate-100 border-b border-gray-300 overflow-x-auto">
                        <div className="flex flex-row w-max">
                            <div className="flex flex-col w-full h-full gap-3 sm:gap-5 p-3 text-base sm:text-xl border-r border-gray-300">
                                <span className="font-semibold">Retailer Name:
                                    <p className="inline font-normal">{trackingData.retailer.generalInfo.retailerName}</p>
                                </span>
                                <span className="font-semibold">Address:
                                    <p className="inline font-normal">{trackingData.retailer.generalInfo.address}</p>
                                </span>
                                <span className="font-semibold">Contact:
                                    <p className="inline font-normal">{trackingData.retailer.generalInfo.contact}</p>
                                </span>
                                <button 
                                    className="underline italic text-blue-600 hover:text-blue-800 transition"
                                    onClick={() => setIsRetailerModalOpen(true)}
                                >
                                    See more
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <FarmSeemore isOpen={isFarmModalOpen}
                onClose={() => setIsFarmModalOpen(false)} />

            <LogisSeemore isOpen={isLogisModalOpen}
                onClose={() => setIsLogisModalOpen(false)} />

            <RetailerSeemore isOpen={isRetailerModalOpen} 
                onClose={() => setIsRetailerModalOpen(false)} />
            <FactorySeemore isOpen={isFactoryModalOpen}
                onClose={() => setIsFactoryModalOpen(false)}/>
        </div>
    );
};

export default TrackingPage;