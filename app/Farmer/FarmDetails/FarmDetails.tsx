"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { getMilkTankDetails, getQRCodeByTankID } from "@/services/rawMilkService"; // ✅ ใช้ชื่อฟังก์ชันให้ตรงกับเซอร์วิซ

const FarmDetails = () => {
    const searchParams = useSearchParams();
    const tankId = searchParams.get("id"); // ✅ ดึง tankId จาก URL

    const [data, setData] = useState(null);
    const [qrCode, setQRCode] = useState<string | null>(null); // ✅ ให้ตรงกับเซอร์วิซ (string | null)

    useEffect(() => {
        const fetchData = async () => {
            if (tankId) {
                try {
                    const milkTankData = await getMilkTankDetails(tankId); // ✅ เรียก API ดึงข้อมูล
                    setData(milkTankData);

                    const qrCodeUrl = await getQRCodeByTankID(tankId); // ✅ เรียก API ดึง QR Code
                    setQRCode(qrCodeUrl);
                } catch (error) {
                    console.error("❌ Error fetching milk tank details:", error);
                }
            }
        };

        fetchData();
    }, [tankId]); // ✅ โหลดข้อมูลใหม่เมื่อ tankId เปลี่ยน

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100">
            <h1 className="text-5xl font-bold">Raw Milk Detail</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14 text-gray-500">
                    {/* Milk tank info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Milk Tank Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Farm Name:</p>
                                <p>{data.milkTankInfo.farmName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Tank ID:</p>
                                <p>{data.milkTankInfo.milkTankNo}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Person in charge:</p>
                                <p>{data.milkTankInfo.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data.milkTankInfo.quantity} {data.milkTankInfo.quantityUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data.milkTankInfo.temp} {data.milkTankInfo.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">ph:</p>
                                <p>{data.milkTankInfo.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.milkTankInfo.fat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.milkTankInfo.protein}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.bacteria === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.contaminants === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.contaminantInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">abnormal characteristic:</p>
                                    <div className="flex flex-col gap-3">
                                        <p className="font-semibold">Smell Bad:</p>
                                        <p className="font-semibold">Smell Not Fresh:</p>
                                        <p className="font-semibold">Abnormal Color:</p>
                                        <p className="font-semibold">Sour:</p>
                                        <p className="font-semibold">Bitter:</p>
                                        <p className="font-semibold">Cloudy:</p>
                                        <p className="font-semibold">Lumpy:</p>
                                        <p className="font-semibold">Separation of milk and water:</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <p>{data.milkTankInfo.abnormalChar === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.smellBad === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.smellNotFresh === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.abnormalColor === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.sour === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.bitter === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.cloudy === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.lumpy === true ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.abnormalType.separation === true ? "True" : "False"}</p>
                                </div>
                            </div>
                            {/* <div className="flex justify-between">
                                <p className="font-semibold">Added By:</p>
                                <p></p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Added On:</p>
                                <p></p>
                            </div> */}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Shipping Address</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Company Name:</p>
                                <p>{data.shippingAddress.companyName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">First Name:</p>
                                <p>{data.shippingAddress.firstName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Last Name:</p>
                                <p>{data.shippingAddress.lastName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Email:</p>
                                <p>{data.shippingAddress.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Address:</p>
                                <p>{data.shippingAddress.address}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Phone:</p>
                                <div className="flex gap-2">
                                    <p>{data.shippingAddress.areaCode}</p>
                                    <p>{data.shippingAddress.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Address:</p>
                                <p>{data.shippingAddress.address}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Province:</p>
                                <p>{data.shippingAddress.province}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">district:</p>
                                <p>{data.shippingAddress.district}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sub-district:</p>
                                <p>{data.shippingAddress.subDistrict}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Postal Code:</p>
                                <p>{data.shippingAddress.postalCode}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location URL:</p>
                                <p className="w-1/2 whitespace-normal break-all">{data.shippingAddress.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Qrcode generate section: Require API */}
            <div className="flex flex-col items-center justify-center mt-10">
            <h1 className="text-6xl">Qrcode Generate Section</h1>                
            {qrCode ? (
                <img 
                    src={qrCode} 
                    alt="Milk Tank QR Code" 
                    className="mt-4 w-1/4 h-auto border-4 border-gray-400 rounded-xl shadow-2xl"
                />
                ) : (
                <p className="text-gray-500 mt-4">No QR Code available</p>
                )}
            </div>
        </div>
    );
};

export default FarmDetails;