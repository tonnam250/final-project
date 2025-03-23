"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from 'next/navigation';
import axios from "axios";

interface MilkTankInfo {
    farmName: string;
    milkTankNo: string;
    personInCharge: string;
    quantity: number;
    quantityUnit: string;
    temp: number;
    tempUnit: string;
    pH: number;
    fat: number;
    protein: number;
    bacteria: boolean;
    bacteriaInfo: string;
    contaminants: boolean;
    contaminantInfo: string;
    abnormalChar: boolean;
    abnormalType: {
        smellBad: boolean;
        smellNotFresh: boolean;
        abnormalColor: boolean;
        sour: boolean;
        bitter: boolean;
        cloudy: boolean;
        lumpy: boolean;
        separation: boolean;
    };
}

interface ShippingAddress {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    areaCode: string;
    phoneNumber: string;
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    location: string;
}

interface FormData {
    milkTankInfo: MilkTankInfo;
    shippingAddress: ShippingAddress;
}

const FarmDetails = () => {

    const [data, setData] = useState(null);
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                const res = await axios.get(`/raw-milk/${id}`, {
                    baseURL: process.env.NEXT_PUBLIC_API_URL,
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(res.data);
            } catch (err) {
                alert("No data found.");
                console.log("Fetching data error: ", err);
            }
        };

        fetchData();
    }, [id]);

    if (!data) return <p>Loading...</p>;

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
                                <p>{data?.milkTankInfo?.milkTankNo}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Person in charge:</p>
                                <p>{data?.milkTankInfo?.personInCharge}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data?.milkTankInfo?.quantity.value} {data?.milkTankInfo?.quantity.suffix}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data?.milkTankInfo?.temperature.value} {data?.milkTankInfo?.temperature.suffix}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">ph:</p>
                                <p>{data?.milkTankInfo?.phOfMilk}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data?.milkTankInfo?.fat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data?.milkTankInfo?.protein}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2 text-end">
                                    <p>{data?.milkTankInfo?.bacteriaTesting.value === true ? 'True' : 'False'}</p>
                                    <p>{data?.milkTankInfo?.bacteriaTesting.additionalInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2 text-end">
                                    <p>{data?.milkTankInfo?.contaminants.value === true ? 'True' : 'False'}</p>
                                    <p>{data?.milkTankInfo?.contaminants.additionalInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Abnormal characteristic:</p>
                                    {data?.milkTankInfo?.abnormalCharacteristics?.choices?.length > 0 ? (
                                        data.milkTankInfo.abnormalCharacteristics.choices.map((choice, index) => (
                                            <p key={index} className="font-normal">{choice}</p>
                                        ))
                                    ) : (
                                        <p className="font-normal">No abnormal characteristics</p>
                                    )}
                                </div>
                            </div>
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
                                    <p>{data.shippingAddress.phone}</p>
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
                                <p className="font-semibold">District:</p>
                                <p>{data.shippingAddress.district}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sub-district:</p>
                                <p>{data.shippingAddress.subdistrict}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Postal Code:</p>
                                <p>{data.shippingAddress.zipCode}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location:</p>
                                <p>{data.shippingAddress.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Qrcode generate section: Require API */}
            <div className="flex">
                <h1 className="text-6xl">Qrcode Generate Section</h1>
            </div>
        </div>
    );
};

export default FarmDetails;