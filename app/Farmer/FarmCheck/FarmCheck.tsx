"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FarmCheck = () => {
    const [data, setData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch("/data/rawMilkDetails.json")
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleSubmit = () => {
        router.push("/Farmer/FarmDetails");
    };

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* Milk tank info */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Milk Tank Info</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Tank ID:</p>
                                <p>{item.milkTankInfo.tankId}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Capacity:</p>
                                <p>{item.milkTankInfo.tankCapacity}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Current Volume:</p>
                                <p>{item.milkTankInfo.tankCurrentVolume}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{item.milkTankInfo.tankTemperature}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{item.milkTankInfo.tankPh}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Conductivity:</p>
                                <p>{item.milkTankInfo.tankConductivity}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">TDS:</p>
                                <p>{item.milkTankInfo.tankTds}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Turbidity:</p>
                                <p>{item.milkTankInfo.tankTurbidity}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{item.milkTankInfo.tankFat}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">SNF:</p>
                                <p>{item.milkTankInfo.tankSnf}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{item.milkTankInfo.tankProtein}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Lactose:</p>
                                <p>{item.milkTankInfo.tankLactose}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Water:</p>
                                <p>{item.milkTankInfo.tankWater}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Urea:</p>
                                <p>{item.milkTankInfo.tankUrea}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Freezing Point:</p>
                                <p>{item.milkTankInfo.tankFreezingPoint}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Added By:</p>
                                <p>{item.milkTankInfo.tankAddedBy}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Added On:</p>
                                <p>{new Date(item.milkTankInfo.tankAddedOn).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center">Shipping Address</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Address:</p>
                                <p>{item.shippingAddress.address}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contact Person:</p>
                                <p>{item.shippingAddress.contactPerson}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contact Number:</p>
                                <p>{item.shippingAddress.contactNumber}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Email:</p>
                                <p>{item.shippingAddress.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Postal Code:</p>
                                <p>{item.shippingAddress.postalCode}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location URL:</p>
                                <p><a href={item.shippingAddress.locationUrl} target="_blank" rel="noopener noreferrer">{item.shippingAddress.locationUrl}</a></p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Shipping Date:</p>
                                <p>{new Date(item.shippingAddress.shippingDate).toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Shipping By:</p>
                                <p>{item.shippingAddress.shippingBy}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" onClick={handleSubmit} className="text-xl bg-emerald-400 p-3 mb-5 self-end mx-14 rounded-3xl text-white font-semibold">Submit</button>
        </div>
    );
}

export default FarmCheck;