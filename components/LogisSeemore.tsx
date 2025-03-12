// ในนี้ดึงข้อมูลที่เก็บไว้ใน localStorage มาแสดงผล ซึ่งใน localStorage มีข้อมูลอยู่อันเดียว
// แต่จำลองการแสดงผลวในส่วนของ logistic see more เสมือนดึงข้อมูลมาจาก 3 ส่วน Before, During, After


"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface LogisSeemoreProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogisSeemore({ isOpen, onClose }: LogisSeemoreProps) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("LogisRecieve");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-2xl shadow-lg w-full max-w-lg lg:max-w-7xl h-auto max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition"
                >
                    <X className="w-5 h-5" />
                </button>
                <h1 className="text-4xl font-bold mb-4 text-center">Logistic Detail</h1>
                <h1 className="text-center self-center text-4xl font-bold mt-10">Before</h1>
                {data.map((item, index) => (
                    item.GeneralInfo && item.ProductDetail && (
                        <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                            {/* General Info */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">General Info</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status:</p>
                                        <p>Before</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Farm Name:</p>
                                        <p>{item.GeneralInfo.farmName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Milk Tank No:</p>
                                        <p>{item.GeneralInfo.milkTankNo}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Person In Charge:</p>
                                        <p>{item.GeneralInfo.personInCharge}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status</p>
                                        <p>{item.GeneralInfo.recieveStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Detail */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">Product Detail</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Quantity:</p>
                                        <p>{item.ProductDetail.quantity} {item.ProductDetail.quantityUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Temperature:</p>
                                        <p>{item.ProductDetail.temp} {item.ProductDetail.tempUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Company Name:</p>
                                        <p>{item?.ProductDetail?.companyName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Name:</p>
                                        <p>{item?.ProductDetail?.firstName} {item?.ProductDetail?.lastName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Email:</p>
                                        <p>{item?.ProductDetail?.email}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Phone:</p>
                                        <p>{item?.ProductDetail?.areaCode} {item?.ProductDetail?.phoneNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Address:</p>
                                        <p>{item?.ProductDetail?.address}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Province:</p>
                                        <p>{item?.ProductDetail?.province}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">District:</p>
                                        <p>{item?.ProductDetail?.district}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Sub-District:</p>
                                        <p>{item?.ProductDetail?.subDistrict}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Zip Code:</p>
                                        <p>{item?.ProductDetail?.postalCode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Location:</p>
                                        <p>{item?.ProductDetail?.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}

                <h1 className="text-center text-4xl font-bold">During</h1>
                {data.map((item, index) => (
                    item.GeneralInfo && item.ProductDetail && (
                        <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                            {/* General Info */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">General Info</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status:</p>
                                        <p>Before</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Farm Name:</p>
                                        <p>{item.GeneralInfo.farmName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Milk Tank No:</p>
                                        <p>{item.GeneralInfo.milkTankNo}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Person In Charge:</p>
                                        <p>{item.GeneralInfo.personInCharge}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status</p>
                                        <p>{item.GeneralInfo.recieveStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Detail */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">Product Detail</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Quantity:</p>
                                        <p>{item.ProductDetail.quantity} {item.ProductDetail.quantityUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Temperature:</p>
                                        <p>{item.ProductDetail.temp} {item.ProductDetail.tempUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Company Name:</p>
                                        <p>{item?.ProductDetail?.companyName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Name:</p>
                                        <p>{item?.ProductDetail?.firstName} {item?.ProductDetail?.lastName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Email:</p>
                                        <p>{item?.ProductDetail?.email}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Phone:</p>
                                        <p>{item?.ProductDetail?.areaCode} {item?.ProductDetail?.phoneNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Address:</p>
                                        <p>{item?.ProductDetail?.address}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Province:</p>
                                        <p>{item?.ProductDetail?.province}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">District:</p>
                                        <p>{item?.ProductDetail?.district}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Sub-District:</p>
                                        <p>{item?.ProductDetail?.subDistrict}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Zip Code:</p>
                                        <p>{item?.ProductDetail?.postalCode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Location:</p>
                                        <p>{item?.ProductDetail?.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}

                <h1 className="text-center text-4xl font-bold">After</h1>
                {data.map((item, index) => (
                    item.GeneralInfo && item.ProductDetail && (
                        <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                            {/* General Info */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">General Info</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status:</p>
                                        <p>Before</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Farm Name:</p>
                                        <p>{item.GeneralInfo.farmName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Milk Tank No:</p>
                                        <p>{item.GeneralInfo.milkTankNo}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Person In Charge:</p>
                                        <p>{item.GeneralInfo.personInCharge}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Recieve Status</p>
                                        <p>{item.GeneralInfo.recieveStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Detail */}
                            <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 p-4 md:p-10 text-base md:text-xl">
                                <h1 className="text-xl sm:text-3xl font-bold text-center">Product Detail</h1>
                                <div className="flex flex-col space-y-2 gap-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Quantity:</p>
                                        <p>{item.ProductDetail.quantity} {item.ProductDetail.quantityUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Temperature:</p>
                                        <p>{item.ProductDetail.temp} {item.ProductDetail.tempUnit}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Company Name:</p>
                                        <p>{item?.ProductDetail?.companyName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Name:</p>
                                        <p>{item?.ProductDetail?.firstName} {item?.ProductDetail?.lastName}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Email:</p>
                                        <p>{item?.ProductDetail?.email}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Phone:</p>
                                        <p>{item?.ProductDetail?.areaCode} {item?.ProductDetail?.phoneNumber}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Address:</p>
                                        <p>{item?.ProductDetail?.address}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Province:</p>
                                        <p>{item?.ProductDetail?.province}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">District:</p>
                                        <p>{item?.ProductDetail?.district}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Sub-District:</p>
                                        <p>{item?.ProductDetail?.subDistrict}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Zip Code:</p>
                                        <p>{item?.ProductDetail?.postalCode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Location:</p>
                                        <p>{item?.ProductDetail?.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}