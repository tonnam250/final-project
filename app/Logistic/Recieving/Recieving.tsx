"use client";

import { useEffect, useState, useRef } from "react";
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

    // for province fetching
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");

    useEffect(() => {
        fetch("/data/geography.json")
            .then((res) => res.json())
            .then((data: GeoData[]) => {
                setGeoData(data);

                // ดึงจังหวัดที่ไม่ซ้ำ (ใช้ภาษาไทยให้ตรงกับ selectedProvince)
                const provinces = Array.from(new Set(data.map((item) => item.provinceNameEn)));
                setProvinceList(provinces);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
                )
            );

            setDistrictList(filteredDistricts);
            setSelectedDistrict("");
            setSubDistrictList([]);
            setSelectedSubDistrict("");
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const filteredSubDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
                )
            );

            setSubDistrictList(filteredSubDistricts);
            setSelectedSubDistrict("");
        }
    }, [selectedDistrict]);
    // end province fetching function

    // Step status update function
    const [showShippingAddress, setShowShippingAddress] = useState<boolean>(false);
    const shippingAddressRef = useRef<HTMLDivElement>(null);

    const handleNextClick = () => {
        setShowShippingAddress(true);
        setTimeout(() => {
            shippingAddressRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    }

    // save form Data
    const [LogisRecieve, setLogisRecieve] = useState({
        GeneralInfo: {
            recieveStatus: "", // moved here
            farmName: "",
            milkTankNo: "",
            personInCharge: ""
        },
        ProductDetail: {
            deliverTime: "",
            recieveTime: "",
            quantity: 0,
            quantityUnit: "Ton",
            temp: 0,
            tempUnit: "Celcius",
            companyName: "",
            firstName: "",
            lastName: "",
            email: "",
            areaCode: "+66",
            phoneNumber: "",
            address: "",
            province: "",
            district: "",
            subDistrict: "",
            postalCode: "",
            location: ""
        },
    });

    // ✅ ควบคุมการแสดงผลของ abnormalType
    const [showAbnormalInfo, setShowAbnormalInfo] = useState(false);

    // ✅ โหลดข้อมูลจาก localStorage เมื่อหน้าเว็บโหลด
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("LogisRecieve");
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData.GeneralInfo && parsedData.GeneralInfo.recieveStatus) {
                    setLogisRecieve(parsedData);
                } else {
                    // Move recieveStatus to GeneralInfo if it exists outside
                    const updatedData = {
                        ...parsedData,
                        GeneralInfo: {
                            ...parsedData.GeneralInfo,
                            recieveStatus: parsedData.recieveStatus || ""
                        }
                    };
                    setLogisRecieve(updatedData);
                    localStorage.setItem("LogisRecieve", JSON.stringify(updatedData));
                }
            }
        }
    }, []); 0

    // ✅ บันทึกข้อมูลลง localStorage ทุกครั้งที่ LogisRecieve เปลี่ยน
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("LogisRecieve", JSON.stringify(LogisRecieve));
        }
    }, [LogisRecieve]);

    // ✅ ฟังก์ชัน handleLogisRecieveChange รองรับ text, select และ checkbox
    const handleLogisRecieveChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value, checked } = event.target;
        const keys = name.split(".");

        setLogisRecieve((prevData) => {
            const updatedData = { ...prevData }; // Clone ข้อมูลเดิม
            let temp = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]];
            }

            // ถ้าเป็น checkbox ให้ใช้ checked ถ้าไม่ใช่ให้ใช้ value
            temp[keys[keys.length - 1]] = type === "checkbox" ? checked : value;

            // อัปเดต province, district และ subdistrict
            if (name === "ProductDetail.province") {
                setSelectedProvince(value);
            } else if (name === "ProductDetail.district") {
                setSelectedDistrict(value);
            } else if (name === "ProductDetail.subDistrict") {
                setSelectedSubDistrict(value);
            }

            return updatedData;
        });
    };

    // ✅ ฟังก์ชัน handleAbnormalChange → เช็ค abnormalChar และโชว์ abnormalType
    const handleAbnormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleLogisRecieveChange(event);
        setShowAbnormalInfo(event.target.checked);
    };

    // ✅ ฟังก์ช์น handleNestedCheckboxChange สำหรับ abnormalType
    const handleNestedCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setLogisRecieve((prevData) => ({
            ...prevData,
            ProductDetail: {
                ...prevData.ProductDetail,
                abnormalType: {
                    ...prevData.ProductDetail.abnormalType,
                    [name.split('.').pop()!]: checked
                }
            }
        }));
    };

    // ✅ ฟังก์ช์น Submit → บันทึกข้อมูลลง localStorage
    const saveToLocalStorage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("LogisRecieve", JSON.stringify(LogisRecieve));
        alert("Information Save!");
        console.log(LogisRecieve);
    };

    const saveToLocalStorageAndNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        localStorage.setItem("LogisRecieve", JSON.stringify(LogisRecieve));
        router.push('/Logistic/Recieving/CheckDetails');
    };

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            {/* Detail Status */}
            <div className="flex items-center w-full mt-28 h-full p-10">
                <div className="flex border shadow-xl w-full h-full p-5 rounded-3xl gap-8">
                    {/* First Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex w-14 text-center p-2 rounded-full mb-2 bg-yellow-200 text-amber-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full w-1/5"></div>
                        </div>
                        <p className="text-xl font-semibold">STEP 1</p>
                        <h1 className="text-3xl font-semibold mb-3">General Information</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-yellow-200 text-amber-500">
                            <p className="text-lg font-semibold">In Progress</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex w-14 text-center p-2 rounded-full mb-2 bg-gray-200 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-200 h-2 rounded-full w-0"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-500">STEP 2</p>
                        <h1 className="text-3xl font-semibold mb-3 text-gray-500">Product Detail</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 bg-gray-200 text-gray-500">
                            <p className="text-lg font-semibold">Not finished</p>
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
                        <h1 className="text-3xl font-semibold mb-3 text-gray-500">Confirm Details</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-gray-200 text-gray-500">
                            <p className="text-lg font-semibold">Not finished</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            <form className="flex flex-col w-5/6 h-full p-20 m-10" onSubmit={saveToLocalStorage}>
                {/* General Info Section */}
                <div className="flex flex-col items-center w-full h-full text-xl gap-5">
                    <h1 className="text-5xl font-bold">General Information</h1>
                    {/* Recieving Status */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="recieveStatus" className="font-semibold">Recieving Status</label>
                        <select name="GeneralInfo.recieveStatus" id="recieveStatus" className="border rounded-full p-3 w-fit"
                            value={LogisRecieve.GeneralInfo.recieveStatus} onChange={handleLogisRecieveChange}>
                            <option value="Before">Before</option>
                            <option value="During">During</option>
                            <option value="After">After</option>
                        </select>
                    </div>
                    {/* Farm Name */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="farmName" className="font-semibold">Farm Name</label>
                        <input type="text" id="farmName"
                            placeholder="Enter your farm name" className="border rounded-full p-3 w-full"
                            name="GeneralInfo.farmName" value={LogisRecieve.GeneralInfo.farmName} onChange={handleLogisRecieveChange} />
                    </div>
                    {/* Milk tank no. */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="milkTankNo" className="font-semibold">Milk Tank No.</label>
                        <input type="text" id="milkTankNo" placeholder="Enter your milk tank number" className="border rounded-full p-3 w-full"
                            name="GeneralInfo.milkTankNo" value={LogisRecieve.GeneralInfo.milkTankNo} onChange={handleLogisRecieveChange} />
                    </div>
                    {/* Person in charge */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="personInCharge" className="font-semibold">Person In Charge</label>
                        <input type="text" name="GeneralInfo.personInCharge" id="personInCharge"
                            placeholder="Enter name of person in charge" className="border rounded-full p-3 w-full"
                            value={LogisRecieve.GeneralInfo.personInCharge} onChange={handleLogisRecieveChange} />
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8] ${showShippingAddress ? 'hidden' : ''}`}
                        onClick={handleNextClick}
                    >
                        Next
                    </button>
                </div>

                {/* Product Details section */}
                {showShippingAddress && (
                    <div ref={shippingAddressRef} className="flex flex-col items-center w-full h-full text-xl gap-8 mt-20">
                        <h1 className="text-5xl font-bold">Product Detail</h1>
                        <div className="flex w-full items-center gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="Deliver" className="font-semibold">Pickup Time</label>
                                <input type="datetime-local" name="ProductDetail.deliverTime" id="Deliver" className="border rounded-full p-3 w-full"
                                    value={LogisRecieve.ProductDetail.recieveTime} onChange={handleLogisRecieveChange} />
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="Recieve" className="font-semibold">Deliver Time</label>
                                <input type="datetime-local" name="ProductDetail.recieveTime" id="Recieve" className="border rounded-full p-3 w-full"
                                    value={LogisRecieve.ProductDetail.deliverTime} onChange={handleLogisRecieveChange} />
                            </div>
                        </div>
                        {/* Quantity + temperature */}
                        <div className="flex w-full items-start gap-3">
                            {/* Quantity */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="quantity" className="font-semibold">Quantity</label>
                                <div className="flex gap-3 w-full">
                                    <input type="number" name="ProductDetail.quantity" id="quantity"
                                        className="border rounded-full p-3 w-4/5" placeholder="0.00" step="0.01"
                                        value={LogisRecieve.ProductDetail.quantity} onChange={handleLogisRecieveChange} />
                                    <select name="ProductDetail.quantityUnit" id="quantityUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                                        value={LogisRecieve.ProductDetail.quantityUnit} onChange={handleLogisRecieveChange}>
                                        <option value="Ton">Ton</option>
                                        <option value="Liter">Liter</option>
                                        <option value="Ml">Milliliter</option>
                                        <option value="Oz">Ounce</option>
                                        <option value="CC">cc</option>
                                        <option value="Gallon">Gallon</option>
                                    </select>
                                </div>
                            </div>
                            {/* Temperature */}
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="temp" className="font-semibold">Temperature</label>
                                <div className="flex w-full items-start gap-3">
                                    <input type="number" name="ProductDetail.temp" id="temp" className="p-3 rounded-full border w-4/5" placeholder="0.00" step="0.01"
                                        value={LogisRecieve.ProductDetail.temp} onChange={handleLogisRecieveChange} />
                                    <select name="ProductDetail.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                                        value={LogisRecieve.ProductDetail.tempUnit} onChange={handleLogisRecieveChange}>
                                        <option value="Celcius">°C</option>
                                        <option value="Farenheit">°F</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {/* Company Name */}
                        <div className="flex flex-col w-full gap-5 mt-10">
                            <label htmlFor="companyName" className="font-semibold">Company Name</label>
                            <input type="text" name="ProductDetail.companyName" id="companyName" className="border p-3 rounded-full" placeholder="Enter your company name"
                                value={LogisRecieve.ProductDetail.companyName} onChange={handleLogisRecieveChange} />
                        </div>
                        {/* First name + Last name */}
                        <div className="flex items-center w-full gap-5">
                            <div className="flex flex-col w-1/2 gap-3">
                                <label htmlFor="fName" className="font-semibold">First Name</label>
                                <input type="text" name="ProductDetail.firstName" id="fName" className="border p-3 rounded-full" placeholder="Enter your first name"
                                    value={LogisRecieve.ProductDetail.firstName} onChange={handleLogisRecieveChange} />
                            </div>
                            <div className="flex flex-col w-1/2 gap-3">
                                <label htmlFor="lName" className="font-semibold">Last Name</label>
                                <input type="text" name="ProductDetail.lastName" id="lName" className="border p-3 rounded-full" placeholder="Enter your last name"
                                    value={LogisRecieve.ProductDetail.lastName} onChange={handleLogisRecieveChange} />
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-3">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input type="text" name="ProductDetail.email" id="email" className="border p-3 rounded-full" placeholder="Enter your Email"
                                value={LogisRecieve.ProductDetail.email} onChange={handleLogisRecieveChange} />
                        </div>

                        {/* Phone Number */}
                        <div className="flex flex-col w-full text-start gap-3">
                            <label htmlFor="tel" className="font-semibold">Phone Number</label>
                            <div className="flex flex-row gap-3">

                                {/* Area Code */}
                                <div className="flex flex-col">
                                    <label htmlFor="areaCode" className="sr-only">Area Code</label>
                                    <select
                                        name="ProductDetail.areaCode"
                                        id="areaCode"
                                        className="border border-gray-300 rounded-full p-3 w-auto text-center"
                                        required
                                        value={LogisRecieve.ProductDetail.areaCode}
                                        onChange={handleLogisRecieveChange}
                                    >
                                        <option value="+66">+66</option>
                                    </select>
                                </div>

                                {/* Phone Input */}
                                <input
                                    type="tel"
                                    id="tel"
                                    name="ProductDetail.phoneNumber"
                                    className="border border-gray-300 rounded-full p-3 flex-1 w-10/12"
                                    placeholder="Enter your phone number"
                                    required
                                    value={LogisRecieve.ProductDetail.phoneNumber}
                                    onChange={handleLogisRecieveChange}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex flex-col text-start font-medium w-full h-40 gap-3">
                            <label htmlFor="address">Address</label>
                            <textarea name="ProductDetail.address" id="address" className="border border-gray-300 rounded-3xl p-3 flex-1 w-full"
                                value={LogisRecieve.ProductDetail.address} onChange={handleLogisRecieveChange}></textarea>
                        </div>

                        {/* province */}
                        <div className="flex flex-col w-full text-start gap-3">
                            <label htmlFor="province" className="font-semibold" >Province</label>
                            <select name="ProductDetail.province" id="province" className="border border-gray-300 rounded-full p-3 text-center"
                                value={selectedProvince} onChange={handleLogisRecieveChange}>
                                <option value="">Select province</option>
                                {provinceList.map((prov, index) => (
                                    <option key={index} value={prov}>
                                        {prov}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* district + Sub-District */}
                        <div className="flex flex-row w-full gap-4">
                            <div className="flex flex-col text-start w-6/12 gap-3">
                                <label htmlFor="district" className="font-semibold">District</label>
                                <select name="ProductDetail.district" id="district" className="border border-gray-300 rounded-full p-3 text-center"
                                    value={selectedDistrict} onChange={handleLogisRecieveChange} disabled={!selectedProvince}>
                                    <option value="">Select district</option>
                                    {districtList.map((dist, index) => (
                                        <option key={index} value={dist}>
                                            {dist}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col text-start w-6/12 gap-3">
                                <label htmlFor="subDistrict" className="font-semibold">Sub-District</label>
                                <select name="ProductDetail.subDistrict" id="subDistrict" className="border border-gray-300 rounded-full p-3 text-center"
                                    value={selectedSubDistrict} onChange={handleLogisRecieveChange} disabled={!selectedDistrict}>
                                    <option value="">Select sub-district</option>
                                    {subDistrictList.map((subDist, index) => (
                                        <option key={index} value={subDist}>
                                            {subDist}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Zip/Postal Code */}
                        <div className="flex flex-col text-start w-full gap-3">
                            <label htmlFor="postalCode" className="font-semibold">Zip/Postal Code</label>
                            <input type="text" name="ProductDetail.postalCode" id="postalCode" className="border border-gray-300 rounded-full p-3 w-full" placeholder="Enter postal code"
                                value={LogisRecieve.ProductDetail.postalCode} onChange={handleLogisRecieveChange} />
                        </div>

                        {/* location */}
                        <div className="flex flex-col text-start w-full gap-3">
                            <label htmlFor="location" className="font-semibold">Location</label>
                            <input type="text" name="ProductDetail.location" id="location" className="border border-gray-300 rounded-full p-3 flex-1 w-full"
                                placeholder="Paste location url"
                                value={LogisRecieve.ProductDetail.location}
                                onChange={handleLogisRecieveChange} />
                        </div>

                        <button
                            type="submit"
                            className="flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-full hover:bg-[#C0E0C8]"
                            onClick={saveToLocalStorageAndNavigate}
                        >
                            Next
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};
export default Recieving;