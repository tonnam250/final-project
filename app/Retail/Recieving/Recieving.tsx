"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GeoData {
    id: number;
    provinceCode: number;
    provinceNameEn: string;
    provinceNameTh: string;
    districtCode: number;
    districtNameEn: string;
    districtNameTh: string;
    subdistrictCode: number;
    subdistrictNameEn: string;
    subdistrictNameTh: string;
    postalCode: number;
}

const Recieving = () => {
    const router = useRouter();

    // ✅ ดึงข้อมูลจาก LocalStorage หรือใช้ค่าเริ่มต้น
    const [retailerRecieve, setRetailerRecieve] = useState(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("retailerRecieve");
            return savedData ? JSON.parse(savedData) : {
                pickupTime: "",
                deliveryTime: "",
                quantity: 0,
                quantityUnit: "Crate",
                temperature: 0,
                temperatureUnit: "Celcius",
                companyName: "",
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                address: "",
                province: "",
                district: "",
                subDistrict: "",
                postalCode: "",
                location: ""
            };
        }
        return {};
    });

    // ✅ บันทึกลง LocalStorage เมื่อมีการเปลี่ยนแปลงข้อมูล
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("retailerRecieve", JSON.stringify(retailerRecieve));
        }
    }, [retailerRecieve]);

    // ✅ อัปเดตข้อมูลใน retailerRecieve
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setRetailerRecieve((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ✅ ดึงข้อมูลภูมิศาสตร์ (Province/District/Subdistrict)
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

    useEffect(() => {
        fetch("/data/geography.json")
            .then((res) => res.json())
            .then((data: GeoData[]) => {
                setGeoData(data);
                setProvinceList(Array.from(new Set(data.map((item) => item.provinceNameEn))));
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        if (retailerRecieve.province) {
            setDistrictList(
                Array.from(new Set(geoData.filter((item) => item.provinceNameEn === retailerRecieve.province)
                    .map((item) => item.districtNameEn)))
            );
            setRetailerRecieve((prev) => ({ ...prev, district: "", subDistrict: "" }));
            setSubDistrictList([]);
        }
    }, [retailerRecieve.province]);

    useEffect(() => {
        if (retailerRecieve.district) {
            setSubDistrictList(
                Array.from(new Set(geoData.filter((item) => item.districtNameEn === retailerRecieve.district)
                    .map((item) => item.subdistrictNameEn)))
            );
            setRetailerRecieve((prev) => ({ ...prev, subDistrict: "" }));
        }
    }, [retailerRecieve.district]);

    // ✅ จัดการขั้นตอนของ UI (Step Status)
    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);
    const [stepStatus, setStepStatus] = useState({
        step1: 'in-progress',
        step2: 'not-started',
        step3: 'not-started'
    });

    const handleNextClick = () => {
        setShowShippingAddress(true);
        setStepStatus({
            step1: 'completed',
            step2: 'in-progress',
            step3: 'not-started'
        });

        setTimeout(() => {
            shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // ✅ ฟังก์ชัน Submit → ไปหน้าตรวจสอบ `/Retail/Recieving/CheckDetails`
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("retailerRecieve", JSON.stringify(retailerRecieve));
        console.log("📦 Saved Retailer Data:", retailerRecieve);
        router.push("/Retail/Recieving/CheckDetails");
    };
    
    return (
    

        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-24 bg-gray-100">
            
            {/* Detail Status */}
            <div className="flex items-center w-full mt-10 h-full p-10">
                <div className="flex border shadow-xl w-full h-full p-5 rounded-3xl gap-8">
                    {/* First Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 w-full' : 'bg-yellow-400 w-1/5'}`}></div>
                        </div>
                        <p className="text-xl font-semibold">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3">Recipient Info</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step2 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step2 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>Quality</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex bg-gray-200 w-14 text-center text-gray-500 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-500">STEP 3</p>
                        <h1 className="text-3xl font-semibold mb-3 text-gray-500">Check Details</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-gray-200 text-gray-500">
                            <p className="text-lg font-semibold">Not finished</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {/* Form Section */}
            <form className="w-full max-w-4xl p-5 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full h-full text-xl gap-5">
    <h1 className="text-5xl font-bold">Recipient Information</h1>

    {/* Person in charge */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="personInCharge" className="font-semibold">Person In Charge</label>
        <input type="text" name="personInCharge" id="personInCharge"
            placeholder="Enter name of person in charge"
            className="border rounded-full p-3 w-full"
            value={retailerRecieve.personInCharge}
            onChange={handleChange} />
    </div>

    {/* Email */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="email" className="font-semibold">Email</label>
        <input type="email" name="email" id="email"
            placeholder="Enter email"
            className="border rounded-full p-3 w-full"
            value={retailerRecieve.email}
            onChange={handleChange} />
    </div>

    {/* Phone Number */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="phoneNumber" className="font-semibold">Phone Number</label>
        <input type="tel" name="phoneNumber" id="phoneNumber"
            placeholder="Enter phone number"
            className="border rounded-full p-3 w-full"
            value={retailerRecieve.phoneNumber}
            onChange={handleChange} />
    </div>

    {/* Address */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="address" className="font-semibold">Address</label>
        <textarea name="address" id="address"
            placeholder="Enter address"
            className="border rounded-3xl p-3 w-full"
            value={retailerRecieve.address}
            onChange={handleChange} />
    </div>

    {/* Province */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="province" className="font-semibold">Province</label>
        <select name="province" id="province"
            className="border rounded-full p-3 w-full"
            value={selectedProvince}
            onChange={(e) => {
                handleChange(e);
                setSelectedProvince(e.target.value);
            }}>
            <option value="">Select Province</option>
            {provinceList.map((prov, index) => (
                <option key={index} value={prov}>{prov}</option>
            ))}
        </select>
    </div>

    {/* District + Sub-district */}
    <div className="flex flex-row w-full gap-4">
        {/* District */}
        <div className="flex flex-col w-1/2 items-start gap-3">
            <label htmlFor="district" className="font-semibold">District</label>
            <select name="district" id="district"
                className="border rounded-full p-3 w-full"
                value={selectedDistrict}
                onChange={(e) => {
                    handleChange(e);
                    setSelectedDistrict(e.target.value);
                }}
                disabled={!selectedProvince}>
                <option value="">Select District</option>
                {districtList.map((dist, index) => (
                    <option key={index} value={dist}>{dist}</option>
                ))}
            </select>
        </div>

        {/* Sub-district */}
        <div className="flex flex-col w-1/2 items-start gap-3">
            <label htmlFor="subDistrict" className="font-semibold">Sub-District</label>
            <select name="subDistrict" id="subDistrict"
                className="border rounded-full p-3 w-full"
                value={selectedSubDistrict}
                onChange={(e) => {
                    handleChange(e);
                    setSelectedSubDistrict(e.target.value);
                }}
                disabled={!selectedDistrict}>
                <option value="">Select Sub-District</option>
                {subDistrictList.map((subDist, index) => (
                    <option key={index} value={subDist}>{subDist}</option>
                ))}
            </select>
        </div>
    </div>

    {/* Postal Code */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="postalCode" className="font-semibold">Postal Code</label>
        <input type="text" name="postalCode" id="postalCode"
            placeholder="Enter postal code"
            className="border rounded-full p-3 w-full"
            value={retailerRecieve.postalCode}
            onChange={handleChange} />
    </div>

    {/* Location */}
    <div className="flex flex-col w-full items-start gap-3">
        <label htmlFor="location" className="font-semibold">Location</label>
        <input type="text" name="location" id="location"
            placeholder="Paste location URL"
            className="border rounded-full p-3 w-full"
            value={retailerRecieve.location}
            onChange={handleChange} />
    </div>

    <button
        type="button"
        className={`flex text-center justify-center self-end bg-[#C2CC8D] text-[#52600A] p-3 w-1/12 rounded-full hover:bg-[#C0E0C8] ${showShippingAddress ? 'hidden' : ''}`}
        onClick={handleNextClick}
    >
        Next
    </button>




                {/* Shipping Address section */}
{showShippingAddress && (
    <div ref={shippingAddressRef} className="flex flex-col items-center w-full h-full text-xl gap-8 mt-20">
        <h1 className="text-5xl font-bold mb-10">Product Quality & Receiving Status</h1>

        {/* Pickup Time */}
        <div className="flex flex-col w-full items-start gap-3">
            <label htmlFor="pickupTime" className="font-semibold">Pickup Time</label>
            <input 
                type="datetime-local" 
                name="pickupTime" 
                id="pickupTime" 
                className="border rounded-full p-3 w-full"
                value={retailerRecieve.pickupTime} 
                onChange={handleChange} 
            />
        </div>

        {/* Delivery Time */}
        <div className="flex flex-col w-full items-start gap-3">
            <label htmlFor="deliveryTime" className="font-semibold">Delivery Time</label>
            <input 
                type="datetime-local" 
                name="deliveryTime" 
                id="deliveryTime" 
                className="border rounded-full p-3 w-full"
                value={retailerRecieve.deliveryTime} 
                onChange={handleChange} 
            />
        </div>
        {/* Quantity Unit */}
        <div className="flex flex-col w-full items-start gap-3">
            <label htmlFor="quantityUnit" className="font-semibold">Quantity Unit</label>
            <select 
                name="quantityUnit" 
                id="quantityUnit" 
                className="border rounded-full p-3 w-full font-semibold"
                value={retailerRecieve.quantityUnit} 
                onChange={handleChange}
            >
                <option value="Crate">Crate</option>
                <option value="Box">Box</option>
                <option value="Bag">Bag</option>
                <option value="Pallet">Pallet</option>
            </select>
        </div>

        {/* Temperature */}
        <div className="flex flex-col w-full items-start gap-3">
            <label htmlFor="temperature" className="font-semibold">Storage Temperature</label>
            <div className="flex w-full items-start gap-3">
                <input 
                    type="number" 
                    name="temperature" 
                    id="temperature" 
                    className="border rounded-full p-3 w-4/5" 
                    placeholder="0.00" 
                    step="0.01"
                    value={retailerRecieve.temperature} 
                    onChange={handleChange} 
                />
                <select 
                    name="temperatureUnit" 
                    id="temperatureUnit" 
                    className="border rounded-full p-3 w-1/5 font-semibold"
                    value={retailerRecieve.temperatureUnit} 
                    onChange={handleChange}
                >
                    <option value="Celcius">°C</option>
                    <option value="Fahrenheit">°F</option>
                </select>
            </div>
        </div>

        {/* Product Quality Status */}
        <div className="flex flex-col w-full items-start gap-3">
            <label className="font-semibold">Product Quality Status</label>
            <div className="flex gap-5">
                <label className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        name="qualityStatus" 
                        value="pass"
                        checked={retailerRecieve.qualityStatus === "pass"}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span>Pass</span>
                </label>
                <label className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        name="qualityStatus" 
                        value="fail"
                        checked={retailerRecieve.qualityStatus === "fail"}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span>Fail</span>
                </label>
            </div>
        </div>

        {/* Accept/Reject Product */}
        <div className="flex flex-col w-full items-start gap-3">
            <label className="font-semibold">Receiving Decision</label>
            <div className="flex gap-5">
                <label className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        name="receivingDecision" 
                        value="accept"
                        checked={retailerRecieve.receivingDecision === "accept"}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span>Accept</span>
                </label>
                <label className="flex items-center gap-2">
                    <input 
                        type="radio" 
                        name="receivingDecision" 
                        value="reject"
                        checked={retailerRecieve.receivingDecision === "reject"}
                        onChange={handleChange}
                        className="w-5 h-5"
                    />
                    <span>Reject</span>
                </label>
            </div>
        </div>

        <button
            type="submit"
            className="flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8]"
            onClick={handleSubmit}
        >
            Submit
        </button>
    </div>
)}
            </form>
        </div>
    );
};

export default Recieving;