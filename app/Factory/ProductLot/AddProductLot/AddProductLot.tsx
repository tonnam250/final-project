"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const AddProductLot = () => {
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
    const [stepStatus, setStepStatus] = useState({
        step1: 'in-progress',
        step2: 'not-started',
        step3: 'not-started',
        step4: 'not-started',
        step5: 'not-started',
        step6: 'not-started'
    });

    const [visibleSection, setVisibleSection] = useState<number>(1);

    const handleNextClick = (currentStep: number) => {
        const nextStep = currentStep + 1;
        setStepStatus((prevStatus) => {
            const newStatus = { ...prevStatus, [`step${currentStep}`]: 'completed' };
            if (nextStep <= 6) {
                newStatus[`step${nextStep}`] = 'in-progress';
            }
            return newStatus;
        });
        setVisibleSection(nextStep);
        setTimeout(() => {
            document.getElementById(`section${nextStep}`)?.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay to ensure the section is rendered
    };
    // end step status update function

    // save form Data
    const [recievedForm, setFormData] = useState({
        RecipientInfo: {
            productName: "",
            category: "",
            description: "",
            quality: ""
        },
        Quantity: {
            quantity: 0,
            quantityUnit: "Ton",
            temp: 0,
            tempUnit: "Celcius",
            pH: 0,
            fat: 0,
            protein: 0,
            bacteria: false,
            bacteriaInfo: "",
            contaminants: false,
            contaminantInfo: "",
            abnormalChar: false,
            abnormalType: {
                smellBad: false,
                smellNotFresh: false,
                abnormalColor: false,
                sour: false,
                bitter: false,
                cloudy: false,
                lumpy: false,
                separation: false
            }
        }
    });

    // ✅ \u04E04\u04E27\u04E1A\u04E04\u04E38\u04E23\u04E07\u04E01\u04E23\u04E32\u04E07\u04E2B\u04E27\u04E31\u04E14\u04E17\u04E35\u04E48 abnormalType
    const [showAbnormalInfo, setShowAbnormalInfo] = useState(false);

    // ✅ \u04E42\u04E2D\u04E14\u04E02\u04E49\u04E21\u04E39\u04E25\u04E08\u04E32\u04E01 localStorage \u04E40\u04E21\u04E37\u04E48\u04E2D\u04E2B\u04E19\u04E49\u04E32\u04E40\u04E2B\u04E25\u04E14
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedData = localStorage.getItem("recievedForm");
            if (savedData) {
                setFormData(JSON.parse(savedData));
            }
        }
    }, []);

    // ✅ \u04E42\u04E1A\u04E17\u04E36\u04E01\u04E02\u04E49\u04E21\u04E39\u04E25\u04E07 localStorage \u04E17\u04E38\u04E01\u04E04\u04E23\u04E32\u04E07\u04E17\u04E35\u04E48 recieveForm \u04E40\u04E1B\u04E25\u04E35\u04E48\u04E19
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("recievedForm", JSON.stringify(recievedForm));
        }
    }, [recievedForm]);

    // ✅ \u04E1F\u04E31\u04E07\u04E01\u04E4C\u04E32\u04E19 handleFormDataChange \u04E23\u04E2D\u04E07\u04E23\u04E31\u04E1A text, select \u04E41\u04E25\u04E30 checkbox
    const handleFormDataChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value, checked } = event.target;
        const keys = name.split(".");

        setFormData((prevData) => {
            const updatedData = { ...prevData }; // Clone ข้อมูลเดิม
            let temp: any = updatedData;

            for (let i = 0; i < keys.length - 1; i++) {
                temp = temp[keys[i]];
            }

            // ถ้าเป็น checkbox ให้ใช้ checked ถ้าไม่ใช่ให้ใช้ value
            temp[keys[keys.length - 1]] = type === "checkbox" ? checked : value;

            // อัปเดต province, district และ subdistrict
            if (name === "RecipientInfo.province") {
                setSelectedProvince(value);
            } else if (name === "RecipientInfo.district") {
                setSelectedDistrict(value);
            } else if (name === "RecipientInfo.subDistrict") {
                setSelectedSubDistrict(value);
            }

            return updatedData;
        });
    };

    // ✅ \u04E1F\u04E31\u04E07\u04E01\u04E4C\u04E32\u04E19 handleAbnormalChange \u04E21\u04E49\u04E48 \u04E40\u04E0A\u04E47 abnormalChar \u04E41\u04E25\u04E30\u04E42\u04E0A abnormalType
    const handleAbnormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleFormDataChange(event);
        setShowAbnormalInfo(event.target.checked);
    };

    // ✅ \u04E1F\u04E31\u04E07\u04E01\u04E4C\u04E32\u04E19 handleNestedCheckboxChange \u04E2A\u04E33\u04E2B\u04E23\u04E31\u04E1A abnormalType
    const handleNestedCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;

        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let temp = updatedData.Quantity.abnormalType;

            temp[name.split('.').pop()!] = checked;

            return updatedData;
        });
    };

    // ✅ \u04E1F\u04E31\u04E07\u04E01\u04E4C\u04E32\u04E19 Submit \u04E21\u04E49\u04E48 \u04E1A\u04E17\u04E36\u04E01\u04E02\u04E49\u04E21\u04E39\u04E25\u04E07 localStorage
    const saveToLocalStorage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem("recievedForm", JSON.stringify(recievedForm));
        alert("Form Save!");
        console.log(recievedForm);
    };
    // end save form Data

    const router = useRouter();

    return (
        <div className="flex flex-col w-full h-full min-h-screen items-center justify-center pt-20">
            {/* Detail Status */}
            <div className="flex items-center w-full h-full p-10">
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
                        <h1 className="text-3xl font-semibold mb-3">General Info</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step1 === 'completed' ? 'bg-emerald-500 text-white' : 'bg-yellow-200 text-amber-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step1 === 'completed' ? 'Completed' : 'In Progress'}</p>
                        </div>
                    </div>
                    {/* Second Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 text-gray-500'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step2 === 'completed' ? 'text-black' : stepStatus.step2 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>STEP 2</p>
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step2 === 'completed' ? 'text-black' : stepStatus.step2 === 'in-progress' ? 'text-black' : 'text-gray-500'}`}>Select Milk Tank</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step2 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step2 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step2 === 'completed' ? 'Completed' : stepStatus.step2 === 'in-progress' ? 'In Progress' : 'Not finish'}</p>
                        </div>
                    </div>
                    {/* Third Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full w-0 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step3 === 'completed' ? 'text-black' : stepStatus.step3 === 'in-progress' ? 'text-black' : 'text-gray-500' }`}>STEP 3</p>
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step3 === 'completed' ? 'text-black' : stepStatus.step3 === 'in-progress' ? 'text-black' : 'text-gray-500' }`}>Quality</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step3 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step3 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step3 === 'completed' ? 'Completed' : stepStatus.step3 === 'in-progress' ? 'In Progress' : 'Not finish'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 4-6 */}
            <div className="flex items-center w-full h-full p-10">
                <div className="flex border shadow-xl w-full h-full p-5 rounded-3xl gap-8">
                    {/* Fourth Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-full" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M8 12h8v2H8zm2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4zm-2-2h4.1l.9-.9V16H8zm12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 w-full' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200'}`}></div>
                        </div>
                        <p className="text-xl font-semibold">STEP 4</p>
                        <h1 className="text-3xl font-semibold mb-3">Nutrition</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 ${stepStatus.step4 === 'completed' ? 'bg-emerald-500 text-white' : stepStatus.step4 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step4 === 'completed' ? 'Completed' : stepStatus.step4 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Fifth Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className={`flex w-14 text-center p-2 rounded-full mb-2 ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M0 6v2h19v15h-6.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H4v-5H2v7h3.156c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3h8.312c.446 1.719 1.992 3 3.844 3s3.398-1.281 3.844-3H32v-8.156l-.063-.157l-2-6L29.72 10H21V6zm1 4v2h9v-2zm20 2h7.281L30 17.125V23h-1.156c-.446-1.719-1.992-3-3.844-3s-3.398 1.281-3.844 3H21zM2 14v2h6v-2zm7 8c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2m16 0c1.117 0 2 .883 2 2s-.883 2-2 2s-2-.883-2-2s.883-2 2-2" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-400 w-1/5' : 'bg-gray-200 w-0'}`}></div>
                        </div>
                        <p className={`text-xl font-semibold ${stepStatus.step5 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>STEP 5</p>
                        <h1 className={`text-3xl font-semibold mb-3 ${stepStatus.step5 === 'in-progress' ? 'text-amber-500' : 'text-gray-500'}`}>Shipping</h1>
                        <div className={`flex flex-wrap text-center w-fit items-center justify-center rounded-full mx-5 p-1 px-2 ${stepStatus.step5 === 'in-progress' ? 'bg-yellow-200 text-amber-500' : 'bg-gray-200 text-gray-500'}`}>
                            <p className="text-lg font-semibold">{stepStatus.step5 === 'in-progress' ? 'In Progress' : 'Not finished'}</p>
                        </div>
                    </div>
                    {/* Sixth Step */}
                    <div className="flex flex-col w-1/3 h-full">
                        <div className="flex bg-gray-200 w-14 text-center text-gray-500 p-2 rounded-full mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5zM6 2a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h7.81c-.36-.62-.61-1.3-.73-2H6V4h7v5h5v3.08c.33-.05.67-.08 1-.08c.34 0 .67.03 1 .08V8l-6-6M8 12v2h8v-2m-8 4v2h5v-2Z" />
                            </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-600 h-2 rounded-full w-0"></div>
                        </div>
                        <p className="text-xl font-semibold text-gray-500">STEP 6</p>
                        <h1 className="text-3xl font-semibold mb-3 text-gray-500">Check Details</h1>
                        <div className="flex flex-wrap text-center w-fit items-center justify-center rounded-full p-1 px-2 mx-5 bg-gray-200 text-gray-500">
                            <p className="text-lg font-semibold">Not finished</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* End Detail Status */}

            {/* Form Section */}
            <form className="flex flex-col w-5/6 h-full p-20 m-10" onSubmit={saveToLocalStorage}>
                {/* General info */}
                <div id="section1" className={`flex flex-col items-center w-full h-full text-xl gap-5 ${visibleSection >= 1 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">General Information</h1>
                    {/* Product name */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="productName" className="font-semibold">Product Name</label>
                        <input type="text" name="RecipientInfo.productName" id="productName"
                            placeholder="Enter product name" className="border rounded-full p-3 w-full"
                        />
                    </div>
                    {/* Category */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="category" className="font-semibold">Category</label>
                        <input type="text" id="category"
                            placeholder="Enter category" className="border rounded-full p-3 w-full"
                            name="RecipientInfo.category" />
                    </div>
                    {/* Description */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="description" className="font-semibold">Description</label>
                        <input type="text" id="description" placeholder="Write description" className="border rounded-full p-3 w-full"
                            name="RecipientInfo.description" />
                    </div>
                    {/* Quauntity per unit */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="quantity" className="font-semibold">Quantity per unit</label>
                        <div className="flex gap-3 w-full items-center">
                            <input type="number" name="RecipientInfo.quantity" className="border rounded-full w-5/6 p-3" placeholder="0.00" step={0.01}
                            />
                            <select name="Quantity.quantityUnit" id="Unit" className="border rounded-full p-3 w-1/6 font-semibold text-center"
                            >
                                <option value="liter">Liter</option>
                                <option value="milliliter">Milliliter</option>
                                <option value="gallon">Gallon</option>
                                <option value="cc">cc</option>
                                <option value="ton">Ton</option>
                                <option value="ounce">Ounce</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-2xl hover:bg-[#C0E0C8] ${stepStatus.step1 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(1)}
                    >
                        Next
                    </button>
                </div>

                {/* Select Milk Tank */}
                <div id="section2" className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 2 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Select Milk Tank</h1>
                    <select name="milkTank" id="milkTank" className="border rounded-full p-3 w-1/2 text-center">
                        <option value="T1">Milk Tank 1</option>
                    </select>
                    <div className="flex flex-col justify-center items-center w-1/2 h-fit gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                            <span className="text-xl md:text-2xl font-semibold">Milk Tank No: <p className="font-normal inline">Milk Tank 1</p></span>
                            <span className="text-xl md:text-2xl font-semibold">Quantity: <p className="font-normal inline">5 Liters</p></span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                            <span className="text-xl md:text-2xl font-semibold">Farm Name: <p className="inline font-normal">Farm 1</p></span>
                            <span className="text-xl md:text-2xl font-semibold">Temperature: <p className="inline font-normal">15 °C</p></span>
                        </div>
                        <div className="flex flex-col justify-center items-start w-full">
                            <span className="text-xl md:text-2xl font-semibold">Location: <p className="inline font-normal">IT KMITL</p></span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-1/2 h-fit gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                        <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                            <span className="text-xl md:text-2xl font-semibold">Milk Tank No: <p className="font-normal inline">Milk Tank 1</p></span>
                            <span className="text-xl md:text-2xl font-semibold">Quantity: <p className="font-normal inline">5 Liters</p></span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                            <span className="text-xl md:text-2xl font-semibold">Farm Name: <p className="inline font-normal">Farm 1</p></span>
                            <span className="text-xl md:text-2xl font-semibold">Temperature: <p className="inline font-normal">15 °C</p></span>
                        </div>
                        <div className="flex flex-col justify-center items-start w-full">
                            <span className="text-xl md:text-2xl font-semibold">Location: <p className="inline font-normal">IT KMITL</p></span>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-full gap-5">
                        <span className="text-2xl font-bold">Total Quantity: <p className="inline font-normal">10</p></span>
                        <select name="milkTankInfo.quantityUnit" id="quantityUnit" className="border rounded-full p-3 w-1/10 text-center font-semibold">
                            <option value="Ton">Ton</option>
                            <option value="Liter">Liter</option>
                            <option value="Ml">Milliliter</option>
                            <option value="Oz">Ounce</option>
                            <option value="CC">cc</option>
                            <option value="Gallon">Gallon</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-2xl hover:bg-[#C0E0C8] ${stepStatus.step2 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(2)}
                    >
                        Next
                    </button>
                </div>

                {/* Quality */}
                <div id="section3" className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 3 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Quality</h1>
                    {/* Temperature */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="temp" className="font-semibold">Temperature</label>
                        <div className="flex w-full items-start gap-3">
                            <input type="number" name="milkTankInfo.temp" id="temp" className="p-3 rounded-full border w-4/5" placeholder="0.00" step="0.01"
                            />
                            <select name="milkTankInfo.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/5 font-semibold"
                            >
                                <option value="Celcius">°C</option>
                                <option value="Farenheit">°F</option>
                            </select>
                        </div>
                    </div>
                    {/* pH of Milk */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                        <input type="number" name="milkTankInfo.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Fat + Protein */}
                    <div className="flex w-full items-start gap-3">
                        {/* Fat */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                            <input type="number" name="milkTankInfo.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                            />
                        </div>
                        {/* Protein */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                            <input type="number" name="milkTankInfo.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                            />
                        </div>
                    </div>
                    {/* bacteria testing */}
                    <div className="flex flex-col w-full justify-center gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="milkTankInfo.bacteria"
                                id="bacteria"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"

                            />
                            <label htmlFor="bacteria" className="font-semibold">Bacteria Testing</label>
                        </div>
                        <input
                            type="text"
                            name="milkTankInfo.bacteriaInfo"
                            id="bacteriaInfo"
                            className="border rounded-full p-3"
                            placeholder="Please fill additional information"

                        />
                    </div>
                    {/* Contaminants */}
                    <div className="flex flex-col w-full justify-center gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="milkTankInfo.contaminants"
                                id="milkTankInfo.contaminants"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"

                            />
                            <label htmlFor="contaminants" className="font-semibold">Contaminants</label>
                        </div>
                        <input
                            type="text"
                            name="milkTankInfo.contaminantInfo"
                            id="milkTankInfo.contaminantInfo"
                            className="border rounded-full p-3"
                            placeholder="Please fill additional information"
                        />
                    </div>
                    {/* Abnormal Characteristic */}
                    <div className="flex flex-col w-full justify-center items-start gap-3">
                        <div className="flex w-full items-center gap-3">
                            <input
                                type="checkbox"
                                name="milkTankInfo.abnormalChar"
                                id="abnormalChar"
                                className="w-5 h-5 appearance-none border border-gray-400 rounded-full checked:bg-[#D3D596] checked:border-[#305066]"
                                onChange={handleAbnormalChange}
                            />
                            <label htmlFor="abnormalChar" className="font-semibold">Abnormal Characteristic</label>
                        </div>
                        <div className="flex flex-col w-full items-center gap-3 px-8">
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.smellBad" id="smellBad" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="smellBad" className="font-semibold">Smell Bad</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.smellNotFresh" id="smellNotFresh" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="smellNotFresh" className="font-semibold">Smell not fresh</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.abnormalColor" id="abnormalColor" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="abnormalColor" className="font-semibold">Abnormal Color</label>
                                <p className="text-gray-500">ex. yellow or green</p>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.sour" id="sour" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="sour" className="font-semibold">Sour taste</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.bitter" id="bitter" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="bitter" className="font-semibold">Bitter taste</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.cloudy" id="cloudy" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="cloudy" className="font-semibold">Cloudy Appearance</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.lumpy" id="lumpy" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="lumpy" className="font-semibold">Lumpy Appearance</label>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <input type="checkbox" name="milkTankInfo.abnormalType.separation" id="separation" className="border w-4 h-4"
                                    onChange={handleNestedCheckboxChange} />
                                <label htmlFor="separation" className="font-semibold">Separation between water and fat</label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-2xl hover:bg-[#C0E0C8] ${stepStatus.step3 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(3)}
                    >
                        Next
                    </button>
                </div>

                {/* Nutrition */}
                <div id="section4" ref={shippingAddressRef} className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 4 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Nutrition</h1>
                    {/* Calories */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="calories" className="font-semibold">Calories per 100 grams  </label>
                        <input type="number" name="Quantity.calories" id="calories" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Total Fat */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="totalFat" className="font-semibold">Total Fat (g)</label>
                        <input type="number" name="Quantity.totalFat" id="totalFat" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Colestoral */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="colestoral" className="font-semibold">Colestoral (mg)</label>
                        <input type="number" name="Quantity.colestoral" id="colestoral" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Sodium */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="sodium" className="font-semibold">Sodium (mg)</label>
                        <input type="number" name="Quantity.sodium" id="sodium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Potassium */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="potassium" className="font-semibold">Potassium (mg)</label>
                        <input type="number" name="Quantity.potassium" id="potassium" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Total Carbohydrates */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="totalCarbohydrates" className="font-semibold">Total Carbohydrates (g)</label>
                        <input type="number" name="Quantity.totalCarbohydrates" id="totalCarbohydrates" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="fiber" className="font-semibold" >Dietary Fiber (g)</label>
                                <input type="number" name="Quantity.fiber" id="fiber" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="sugar" className="font-semibold">Sugar (g)</label>
                                <input type="number" name="Quantity.sugar" id="sugar" className="border rounded-full w-full p-3" placeholder="0.00" step="0.01"
                                />
                            </div>
                        </div>
                    </div>
                    {/*temperature */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="temp" className="font-semibold">Temperature</label>
                        <div className="flex w-full items-start gap-3">
                            <input type="number" name="Quantity.temp" id="temp" className="border p-3 rounded-full borcder w-4/5" placeholder="0.00" step="0.01"
                            />
                            <select name="Quantity.tempUnit" id="tempUnit" className="border rounded-full p-3 w-1/6 font-semibold"
                            >
                                <option value="Celcius">°C</option>
                                <option value="Farenheit">°F</option>
                            </select>
                        </div>
                    </div>
                    {/* pH of Milk */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <label htmlFor="pH" className="font-semibold">pH of Milk</label>
                        <input type="number" name="Quantity.pH" id="pH" className="p-3 border rounded-full w-full" placeholder="0.00" step="0.01"
                        />
                    </div>
                    {/* Fat + Protein */}
                    <div className="flex w-full items-start gap-3">
                        {/* Fat */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="fat" className="font-semibold">Fat (%)</label>
                            <input type="number" name="Quantity.fat" id="fat" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                            />
                        </div>
                        {/* Protein */}
                        <div className="flex flex-col w-1/2 items-start gap-3">
                            <label htmlFor="protein" className="font-semibold">Protein (%)</label>
                            <input type="number" name="Quantity.protein" id="protein" className="p-3 border rounded-full w-full" placeholder="0.00%" step="0.01"
                            />
                        </div>
                    </div>
                    {/* Vitamins and Minerals */}
                    <div className="flex flex-col w-full items-start gap-3">
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminC" className="font-semibold">Vitamin C (%)</label>
                                <input type="number" name="Quantity.vitaminC" id="vitaminC" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="calcium" className="font-semibold">Calcium (%)</label>
                                <input type="number" name="Quantity.calcium" id="calcium" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="iron" className="font-semibold">Iron (%)</label>
                                <input type="number" name="Quantity.iron" id="iron" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminD" className="font-semibold">Vitamin D (%)</label>
                                <input type="number" name="Quantity.vitaminD" id="vitaminD" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-3">
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminB6" className="font-semibold">Vitamin B6 (%)</label>
                                <input type="number" name="Quantity.vitaminB6" id="vitaminB6" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                            <div className="flex flex-col w-1/2 items-start gap-3">
                                <label htmlFor="vitaminB12" className="font-semibold">Vitamin B12 (%)</label>
                                <input type="number" name="Quantity.vitaminB12" id="vitaminB12" className="border p-3 w-full rounded-full" placeholder="0.00" step="0.01"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-start gap-3">
                            <label htmlFor="magnesium" className="font-semibold">Magnesium (%)</label>
                            <input type="number" name="Quantity.magnesium" id="magnesium" className="border rounded-full p-3 w-full" placeholder="0.00" step="0.01"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-2xl hover:bg-[#C0E0C8] ${stepStatus.step4 === 'completed' ? 'hidden' : ''}`}
                        onClick={() => handleNextClick(4)}
                    >
                        Next
                    </button>
                </div>

                {/* Shipping Address section */}
                <div id="section5" ref={shippingAddressRef} className={`flex flex-col items-center w-full h-full text-xl gap-8 mt-20 ${visibleSection >= 5 ? '' : 'hidden'}`}>
                    <h1 className="text-5xl font-bold">Shipping Address</h1>
                    {/* Company Name */}
                    <div className="flex flex-col w-full gap-5 mt-10">
                        <label htmlFor="companyName" className="font-semibold">Company Name</label>
                        <input type="text" name="shippingAddress.companyName" id="companyName" className="border p-3 rounded-full" placeholder="Enter your company name"
                        />
                    </div>
                    {/* First name + Last name */}
                    <div className="flex items-center w-full gap-5">
                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="fName" className="font-semibold">First Name</label>
                            <input type="text" name="shippingAddress.firstName" id="fName" className="border p-3 rounded-full" placeholder="Enter your first name"
                            />
                        </div>
                        <div className="flex flex-col w-1/2 gap-3">
                            <label htmlFor="lName" className="font-semibold">Last Name</label>
                            <input type="text" name="shippingAddress.lastName" id="lName" className="border p-3 rounded-full" placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input type="text" name="shippingAddress.email" id="email" className="border p-3 rounded-full" placeholder="Enter your Email"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col w-full text-start gap-3">
                        <label htmlFor="tel" className="font-semibold">Phone Number</label>
                        <div className="flex flex-row gap-3">

                            {/* Area Code */}
                            <div className="flex flex-col">
                                <label htmlFor="areaCode" className="sr-only">Area Code</label>
                                <select
                                    name="shippingAddress.areaCode"
                                    id="areaCode"
                                    className="border border-gray-300 rounded-full p-3 w-auto text-center"
                                    required
                                >
                                    <option value="+66">+66</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                </select>
                            </div>

                            {/* Phone Input */}
                            <input
                                type="tel"
                                id="tel"
                                name="shippingAddress.phoneNumber"
                                className="border border-gray-300 rounded-full p-3 flex-1 w-10/12"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col text-start font-medium w-full h-40 gap-3">
                        <label htmlFor="address">Address</label>
                        <textarea name="shippingAddress.address" id="address" className="border border-gray-300 rounded-3xl p-3 flex-1 w-full"
                        ></textarea>
                    </div>

                    {/* province */}
                    <div className="flex flex-col w-full text-start gap-3">
                        <label htmlFor="province" className="font-semibold" >Province</label>
                        <select name="shippingAddress.province" id="province" className="border border-gray-300 rounded-full p-3 text-center"
                            value={selectedProvince} onChange={handleFormDataChange}>
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
                            <select name="shippingAddress.district" id="district" className="border border-gray-300 rounded-full p-3 text-center"
                                value={selectedDistrict} onChange={handleFormDataChange} disabled={!selectedProvince}>
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
                            <select name="shippingAddress.subDistrict" id="subDistrict" className="border border-gray-300 rounded-full p-3 text-center"
                                value={selectedSubDistrict} onChange={handleFormDataChange} disabled={!selectedDistrict}>
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
                        <input type="text" name="shippingAddress.postalCode" id="postalCode" className="border border-gray-300 rounded-full p-3 w-full" placeholder="Enter postal code"
                        />
                    </div>

                    {/* location */}
                    <div className="flex flex-col text-start w-full gap-3">
                        <label htmlFor="location" className="font-semibold">Location</label>
                        <input type="text" name="shippingAddress.location" id="location" className="border border-gray-300 rounded-full p-3 flex-1 w-full"
                            placeholder="Paste location url"
                        />
                    </div>

                    <button
                        type="button"
                        className={`flex text-center self-end bg-[#C2CC8D] text-[#52600A] p-3 rounded-2xl hover:bg-[#C0E0C8]`}
                        onClick={() => router.push('/Factory/ProductLot/CheckDetails')}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};
export default AddProductLot;