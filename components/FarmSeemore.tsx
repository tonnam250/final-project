"use client";

import { FC, useState } from "react";
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

interface FarmSeemoreProps {
    isOpen: boolean;
    onClose: () => void;
    farm?: {
        companyName: string;
        address: string;
        subDistrict: string;
        district: string;
        province: string;
        country: string;
        postCode: string;
        telephone: string;
        email: string;
        locationLink: string;
        milkTankIDs: string[];
    };
}

export default function FarmSeemore({ isOpen, onClose, farm }: FarmSeemoreProps) {
    const [activeTab, setActiveTab] = useState(0);

    if (!isOpen) return null; // ✅ ปิด modal ถ้าไม่เปิด

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8 relative border border-gray-300">

                {/* ปุ่มปิด */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">
                    ✕
                </button>

                {/* ชื่อฟาร์ม */}
                <h2 className="text-5xl font-serif font-bold text-center text-gray-900 tracking-wide uppercase bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-transparent bg-clip-text">
                    {farm?.companyName || "No Data"}
                </h2>

                {/* 🏡 กล่องที่อยู่ */}
                <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-sm border border-gray-300">
                    <div className="flex items-center gap-3 text-lg text-gray-700">
                        <MapPinIcon className="h-6 w-6 text-yellow-500" />
                        <span className="font-semibold">Location:</span>
                        <span className="text-gray-600">
                            {farm?.address ? `${farm.address}, ${farm.subDistrict}, ${farm.district}, ${farm.province}, ${farm.postCode}` : "N/A"}
                        </span>
                    </div>
                    {/* 🔗 ลิงก์ไปยังแผนที่ */}
                    {farm?.locationLink && (
                        <div className="mt-2">
                            <a href={farm.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                                View on Map
                            </a>
                        </div>
                    )}
                </div>

                {/* 📞 กล่องติดต่อ */}
                <div className="mt-6 flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-lg shadow-sm border border-gray-300 flex-1">
                        <PhoneIcon className="h-6 w-6 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Telephone</span>
                            <span className="text-gray-600">{farm?.telephone || "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 px-6 py-4 rounded-lg shadow-sm border border-gray-300 flex-1">
                        <EnvelopeIcon className="h-6 w-6 text-yellow-500" />
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-700">Email</span>
                            <span className="text-gray-600">{farm?.email || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* 🥛 Milk Tanks Section */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4">Milk Tanks</h3>

                    {/* Tabs Navigation */}
                    <div className="flex justify-center mb-4">
                        {farm?.milkTankIDs?.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-4 py-2 mx-1 rounded-full text-sm font-medium ${
                                    activeTab === index ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800"
                                } transition-all`}
                            >
                                Tank {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Tabs Content */}
                    <div className="relative h-32 overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-full transition-all duration-500"
                            style={{ transform: `translateY(-${activeTab * 100}%)` }}
                        >
                            {farm?.milkTankIDs?.map((tank, index) => (
                                <div key={index} className="w-full h-32 flex items-center justify-center">
                                    <div className="px-6 py-3 bg-gray-200 rounded-lg shadow-md text-lg font-medium text-gray-800">
                                        {tank}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ปุ่มปิด */}
                <div className="flex justify-center mt-8">
                    <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition-all">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
