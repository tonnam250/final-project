"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getLogisticsCheckpointsByTrackingId } from "@/services/trackingService";

const Details = () => {
    const [data, setData] = useState<any>(null);
    const [selectedStatus, setSelectedStatus] = useState<"before" | "during" | "after">("before");
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId");
    const [dataArray, setDataArray] = useState<any[]>([]); // ✅ ใช้งานจริง

    useEffect(() => {
        if (!trackingId) {
            console.log("❌ No tracking ID found in URL");
            return;
        }

        console.log("📡 Fetching logistics data for Tracking ID:", trackingId);
        
        getLogisticsCheckpointsByTrackingId(trackingId).then((data) => {
            if (data) {
                console.log("✅ Received logistics data:", data);
                setData(data); // ✅ เก็บข้อมูลทั้งหมด

                // ✅ อัปเดต `dataArray` ตามสถานะที่เลือก
                if (selectedStatus === "before") {
                    setDataArray(data.beforeCheckpoints || []);
                } else if (selectedStatus === "during") {
                    setDataArray(data.duringCheckpoints || []);
                } else if (selectedStatus === "after") {
                    setDataArray(data.afterCheckpoints || []);
                }
            } else {
                console.log("❌ Failed to retrieve logistics data");
            }
        });
    }, [trackingId, selectedStatus]); // ✅ อัปเดตข้อมูลเมื่อ trackingId หรือ selectedStatus เปลี่ยน

    const formatDateTime = (dateTime: number | string) => {
        let date: Date;
        
        if (typeof dateTime === "number") {
            date = new Date(dateTime * 1000); // ✅ Unix Timestamp → Date
        } else {
            date = new Date(dateTime); // ✅ ปกติใช้ string
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
            {/* ✅ ปุ่มเลือกโหมด */}
            <div className="flex gap-4 my-6">
                {["before", "during", "after"].map((status) => (
                    <button
                        key={status}
                        className={`px-6 py-2 rounded-xl transition-all duration-300 font-medium text-lg shadow-sm ${
                            selectedStatus === status ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-200"
                        }`}
                        onClick={() => setSelectedStatus(status as "before" | "during" | "after")}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
    
            {/* ✅ Tracking ID */}
            <h1 className="text-5xl font-bold text-gray-900 mb-6 drop-shadow-lg">Tracking Details</h1>
            <p className="text-lg text-gray-600 bg-white px-8 py-3 rounded-full shadow-md border border-gray-300">
                Tracking ID: <span className="font-semibold text-black">{data?.trackingId || "N/A"}</span>
            </p>
    
            {data && (
                <div className="flex flex-col gap-10 w-full max-w-5xl p-6 md:p-12">
                    {/* ✅ เอา Object แรกของแต่ละหมวด (ก่อน, ระหว่าง, หลัง) */}
                    {data[selectedStatus + "Checkpoints"]?.slice(0, 1).map((checkpoint: any, index: number) => (
                        <div key={index} className="flex flex-col md:flex-row gap-6 transition-all duration-300">
                            {/* 📦 Recipient Info (การ์ดที่ 1) */}
                            <div className="flex-1 bg-white p-8 rounded-3xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl">
                                <h2 className="text-2xl font-bold text-blue-600 mb-5 flex items-center gap-2">
                                    📦 Recipient Info
                                </h2>
                                <div className="flex flex-col space-y-3 text-lg">
                                    <p><strong>👤 Person in Charge:</strong> {checkpoint.personInCharge}</p>
                                    <p><strong>🏢 Company:</strong> {checkpoint.receiverInfo.companyName}</p>
                                    <p><strong>📍 Address:</strong> {checkpoint.receiverInfo.address}</p>
                                    <p><strong>🌍 Province:</strong> {checkpoint.receiverInfo.province}</p>
                                    <p><strong>🏙 District:</strong> {checkpoint.receiverInfo.district}</p>
                                    <p><strong>🏡 Sub-district:</strong> {checkpoint.receiverInfo.subDistrict}</p>
                                    <p><strong>📬 Postal Code:</strong> {checkpoint.receiverInfo.postalCode}</p>
                                    <p><strong>📌 Location:</strong> {checkpoint.receiverInfo.location}</p>
                                    <p><strong>✉ Email:</strong> {checkpoint.receiverInfo.email}</p>
                                    <p><strong>📞 Phone:</strong> {checkpoint.receiverInfo.phone || "-"}</p>
                                </div>
                            </div>
    
                            {/* 🚚 Logistics Info (การ์ดที่ 2) */}
                            <div className="flex-1 bg-white p-8 rounded-3xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-2xl">
                                <h2 className="text-2xl font-bold text-green-600 mb-5 flex items-center gap-2">
                                    🚚 Logistics Info
                                </h2>
                                <div className="flex flex-col space-y-3 text-lg">
                                    <p><strong>📅 Pickup Time:</strong> {new Date(checkpoint.pickupTime * 1000).toLocaleString()}</p>
                                    <p><strong>📦 Delivery Time:</strong> {new Date(checkpoint.deliveryTime * 1000).toLocaleString()}</p>
                                    <p><strong>📊 Quantity:</strong> {checkpoint.quantity} units</p>
                                    <p><strong>🌡 Temperature:</strong> {checkpoint.temperature}°C</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
}

export default Details;