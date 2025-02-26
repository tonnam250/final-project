"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CheckDetails = () => {
    const router = useRouter();
    const [data, setData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("productLotForm");
        if (storedData) {
            setData(JSON.parse(storedData));
        }
    }, []);

    const handleSubmit = () => {
        alert("Form saved successfully!");
        router.push('/Factory/ProductLot/Details');
    };

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100 text-black">
            <h1 className="text-5xl font-bold mt-10 text-black">Product Lot Check Detail</h1>
            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14">
                    {/* General Information */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">General Information</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Product Name:</p>
                                <p>{data.GeneralInfo.productName}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Category:</p>
                                <p>{data.GeneralInfo.category}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Description:</p>
                                <p>{data.GeneralInfo.description}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Quantity:</p>
                                <p>{data.GeneralInfo.quantity} {data.GeneralInfo.quantityUnit}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nutrition */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Nutrition</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Calories:</p>
                                <p>{data.nutrition.calories}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Fat:</p>
                                <p>{data.nutrition.totalFat} g</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Cholesterol:</p>
                                <p>{data.nutrition.colestoral} mg</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sodium:</p>
                                <p>{data.nutrition.sodium} mg</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Potassium:</p>
                                <p>{data.nutrition.potassium} mg</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Total Carbohydrates:</p>
                                <p>{data.nutrition.totalCarbohydrates} g</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fiber:</p>
                                <p>{data.nutrition.fiber} g</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Sugar:</p>
                                <p>{data.nutrition.sugar} g</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin C:</p>
                                <p>{data.nutrition.vitaminC} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Calcium:</p>
                                <p>{data.nutrition.calcium} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Iron:</p>
                                <p>{data.nutrition.iron} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin D:</p>
                                <p>{data.nutrition.vitaminD} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B6:</p>
                                <p>{data.nutrition.vitaminB6} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Vitamin B12:</p>
                                <p>{data.nutrition.vitaminB12} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Magnesium:</p>
                                <p>{data.nutrition.magnesium} %</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {data && (
                <div className="flex flex-col md:flex-row justify-between gap-10 w-full p-4 md:p-14 mt-10">
                    {/* Select Milk Tank */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full h-fit md:w-1/2 bg-white border p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
                        <h1 className="text-xl md:text-3xl font-bold text-center text-black">Select Milk Tank</h1>
                        <div className="flex flex-col space-y-2 gap-3">
                            <div className="flex justify-between">
                                <p className="font-semibold">Temperature:</p>
                                <p>{data.selectMilkTank.temp} {data.selectMilkTank.tempUnit}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">pH:</p>
                                <p>{data.selectMilkTank.pH}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Fat:</p>
                                <p>{data.selectMilkTank.fat} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Protein:</p>
                                <p>{data.selectMilkTank.protein} %</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria:</p>
                                <p>{data.selectMilkTank.bacteria ? "Yes" : "No"}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Bacteria Info:</p>
                                <p>{data.selectMilkTank.bacteriaInfo}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminants:</p>
                                <p>{data.selectMilkTank.contaminants ? "Yes" : "No"}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Contaminant Info:</p>
                                <p>{data.selectMilkTank.contaminantInfo}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Abnormal Characteristic:</p>
                                <p>{data.selectMilkTank.abnormalChar ? "Yes" : "No"}</p>
                            </div>
                            <div className="flex flex-col space-y-2 gap-3">
                                <p className="font-semibold">Abnormal Type:</p>
                                <div className="flex justify-between">
                                    <p>Smell Bad:</p>
                                    <p>{data.selectMilkTank.abnormalType.smellBad ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Smell Not Fresh:</p>
                                    <p>{data.selectMilkTank.abnormalType.smellNotFresh ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Abnormal Color:</p>
                                    <p>{data.selectMilkTank.abnormalType.abnormalColor ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Sour:</p>
                                    <p>{data.selectMilkTank.abnormalType.sour ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Bitter:</p>
                                    <p>{data.selectMilkTank.abnormalType.bitter ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Cloudy:</p>
                                    <p>{data.selectMilkTank.abnormalType.cloudy ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Lumpy:</p>
                                    <p>{data.selectMilkTank.abnormalType.lumpy ? "Yes" : "No"}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Separation:</p>
                                    <p>{data.selectMilkTank.abnormalType.separation ? "Yes" : "No"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="flex flex-col gap-4 md:gap-10 w-full md:w-1/2 border bg-white p-4 md:p-10 rounded-3xl shadow-lg text-base md:text-xl">
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
                                <p className="font-semibold">Phone Number:</p>
                                <p>{data.shippingAddress.areaCode} {data.shippingAddress.phoneNumber}</p>
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
                                <p className="font-semibold">Sub-District:</p>
                                <p>{data.shippingAddress.subDistrict}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Postal Code:</p>
                                <p>{data.shippingAddress.postalCode}</p>
                            </div>
                            <div className="flex justify-between">
                                <p className="font-semibold">Location:</p>
                                <p>{data.shippingAddress.location}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button className="bg-emerald-500 text-white font-semibold text-xl rounded-full p-3 self-end mx-20 mb-10" onClick={handleSubmit}>Submit</button>
        </div>
    );
};
export default CheckDetails;