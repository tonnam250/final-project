import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface FarmSeeMoreModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MilkTankInfo {
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
    areaCode: string;
    phoneNumber: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    location: string;
}

interface FormData {
    farmName: string;
    milkTankInfo: MilkTankInfo;
    shippingAddress: ShippingAddress;
}

export default function FarmSeemore({ isOpen, onClose }: FarmSeeMoreModalProps) {
    const [data, setData] = useState<FormData | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem("formData");
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
                <h1 className="text-3xl font-bold mb-4">Farm Detail</h1>
                {data && (
                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 lg:w-full">
                        {/* General Info Section */}
                        <div className="flex flex-col gap-4 w-full lg:w-[48%] p-4">
                            <h1 className="text-xl font-bold text-center">General Info</h1>
                            <div className="flex justify-between">
                                <p className="font-semibold">Farm Name:</p>
                                <p>{data.farmName}</p>
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
                                <p className="font-semibold">pH:</p>
                                <p>{data.milkTankInfo.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.milkTankInfo.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.milkTankInfo.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.bacteria ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.bacteriaInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <div className="flex flex-col gap-2">
                                    <p>{data.milkTankInfo.contaminants ? "True" : "False"}</p>
                                    <p>{data.milkTankInfo.contaminantInfo}</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold">Abnormal characteristic:</p>
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
                        </div>

                        {/* Shipping Address Section */}
                        <div className="flex flex-col gap-4 w-full lg:w-[48%] bg-white p-4 text-base">
                            <h1 className="text-xl font-bold text-center">Shipping Address</h1>
                            <div className="flex flex-col gap-3">
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
                                    <p className="font-semibold">District:</p>
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
            </div>
        </div>
    );
}