"use client";

import { useEffect, useState } from "react";

const Details = () => {
    const [dataArray, setDataArray] = useState<any[]>([]);

    useEffect(() => {
        const storedData = localStorage.getItem("LogisRecieve");
        if (storedData) {
            console.log("Stored Data:", storedData); // Debug log
            setDataArray(JSON.parse(storedData));
        } else {
            console.log("No data found in localStorage"); // Debug log
        }
    }, []);

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
                                    <p className="font-semibold">Factory Name:</p>
                                    <p>{data.GeneralInfo.farmName || ""}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Product Lot:</p>
                                    <p>{data.GeneralInfo.productLot || ""}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Person In Charge:</p>
                                    <p>{data.GeneralInfo.personInCharge || ""}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Receive Status:</p>
                                    <p>{data.GeneralInfo.recieveStatus || ""}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Detail */}
                        {data.ProductDetail && (
                            <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                                <h1 className="text-xl md:text-3xl font-bold text-center">Product Detail</h1>
                                <div className="flex flex-col space-y-2 gap-3 text-gray-500">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Pickup Time:</p>
                                    <p>{formatDateTime(data.ProductDetail.recieveTime) || ""}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="font-semibold">Deliver Time:</p>
                                    <p>{formatDateTime(data.ProductDetail.deliverTime) || ""}</p>
                                </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Quantity:</p>
                                        <p>{data.ProductDetail.quantity || ""} {data.ProductDetail.quantityUnit || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Temperature:</p>
                                        <p>{data.ProductDetail.temp || ""} {data.ProductDetail.tempUnit || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Company Name:</p>
                                        <p>{data?.ProductDetail?.companyName || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Name:</p>
                                        <p>{data?.ProductDetail?.firstName || ""} {data?.ProductDetail?.lastName || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Email:</p>
                                        <p>{data?.ProductDetail?.email || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Phone:</p>
                                        <p>{data?.ProductDetail?.areaCode || ""} {data?.ProductDetail?.phoneNumber || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Address:</p>
                                        <p>{data?.ProductDetail?.address || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Province:</p>
                                        <p>{data?.ProductDetail?.province || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">District:</p>
                                        <p>{data?.ProductDetail?.district || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Sub-District:</p>
                                        <p>{data?.ProductDetail?.subDistrict || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Zip Code:</p>
                                        <p>{data?.ProductDetail?.postalCode || ""}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Location:</p>
                                        <p>{data?.ProductDetail?.location || ""}</p>
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