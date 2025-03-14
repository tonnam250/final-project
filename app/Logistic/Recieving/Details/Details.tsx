"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ ใช้ดึงค่าจาก URL Query Params
import { getLogisticsCheckpointsByTrackingId } from "@/services/trackingService"; // ✅ เรียก API

const Details = () => {
    const [data, setData] = useState<any>(null); // ✅ เก็บข้อมูล API
    const [selectedStatus, setSelectedStatus] = useState<"before" | "during" | "after">("before"); // ✅ State เลือกสถานะ
    const searchParams = useSearchParams();
    const trackingId = searchParams.get("trackingId"); // ✅ ดึง trackingId จาก URL
    const [dataArray, setDataArray] = useState<any[]>([]); // ✅ เก็บข้อมูล API (เปลี่ยนจาก data เป็น dataArray)

    useEffect(() => {
        if (!trackingId) {
            console.log("❌ No tracking ID found in URL");
            return;
        }

        console.log("📡 Fetching logistics data for Tracking ID:", trackingId);
        
        getLogisticsCheckpointsByTrackingId(trackingId).then((data) => {
            if (data) {
                console.log("✅ Received logistics data:", data);
                setData(data); // ✅ อัปเดต State
            } else {
                console.log("❌ Failed to retrieve logistics data");
            }
        });
    }, [trackingId]); // ✅ โหลดข้อมูลใหม่เมื่อ trackingId เปลี่ยน

    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    return (
        <div className="flex flex-col justify-center items-center w-full h-full min-h-screen pt-24">
            <h1 className="text-5xl font-bold">Details</h1>
            {dataArray.map((data, index) => (
                data && data.GeneralInfo && data.ProductDetail && (
                    <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                        {/* General Info */}
                        <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                            <h1 className="text-xl md:text-3xl font-bold text-center">General Info</h1>
                            <div className="flex flex-col space-y-2 gap-3 text-gray-500">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Tracking ID:</p>
                                    <p>{data.trackingId || "N/A"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Selected Status:</p>
                                    <p className="capitalize">{selectedStatus || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Detail */}
                        {data.ProductDetail && (
                                                        <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                                        <h1 className="text-xl md:text-3xl font-bold text-center">Logistics Checkpoint</h1>
                                                        <div className="flex flex-col space-y-2 gap-3 text-gray-500">
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Pickup Time:</p>
                                                                <p>{formatDateTime(data[selectedStatus]?.pickupTime) || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Deliver Time:</p>
                                                                <p>{formatDateTime(data[selectedStatus]?.deliveryTime) || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Quantity:</p>
                                                                <p>{data[selectedStatus]?.quantity || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Temperature:</p>
                                                                <p>{data[selectedStatus]?.temperature || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Company Name:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.companyName || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Name:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.firstName || ""} {data[selectedStatus]?.receiverInfo?.lastName || ""}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Email:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.email || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Phone:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.phone || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Address:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.address || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Province:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.province || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">District:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.district || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Sub-District:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.subDistrict || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Zip Code:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.postalCode || "N/A"}</p>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold">Location:</p>
                                                                <p>{data[selectedStatus]?.receiverInfo?.location || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                        
                        )}
                    </div>
                )
            ))}
        </div>
    );
}

export default Details;