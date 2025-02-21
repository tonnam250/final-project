"use client";

import { useState, useEffect } from "react";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";
import { updateUserRole } from "@/services/authService"; // ✅ ใช้ updateUserRole
import { getFarmInfo, updateFarmInfo, submitFarmData, createFarm,  } from "@/services/farmService";
import { getCertificateInfo, uploadAndSetCertificate, deleteCertificate, handleDeleteCertificate } from "@/services/certificateService";
import { handleFileChange } from "@/services/fileService";
import { getGeoData, getProvinceList, getDistrictList, getSubDistrictList } from "@/services/geoService";

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

const FarmGeneralInfo = () => {
    const [farmData, setFarmData] = useState<any>(null);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certificateData, setCertificateData] = useState<any | null>(null);
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);


    // ✅ ตรวจสอบว่าผู้ใช้มีฟาร์มหรือยัง
    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                const data = await getFarmInfo();
                if (data) {
                    setFarmData(data);
                    setSelectedProvince(data.province || "");
                } else {
                    setIsCreating(true); // ✅ ถ้ายังไม่มีฟาร์ม ให้เปลี่ยนเป็น Create Mode
                    setIsEditable(true);
                }
            } catch (error) {
                console.error("Error fetching farm data:", error);
                setIsCreating(true);
                setIsEditable(true);
            }
        };
        fetchFarmData();
    }, []);

    // ✅ ดึงข้อมูลภูมิศาสตร์
    useEffect(() => {
        const fetchGeoData = async () => {
            const data = await getGeoData();
            setGeoData(data);
            setProvinceList(getProvinceList(data)); // ✅ ใช้ geoService
        };
        fetchGeoData();
    }, []);

    // ✅ ดึงข้อมูลฟาร์ม
    useEffect(() => {
        const fetchFarmData = async () => {
            try {
                const data = await getFarmInfo();
                if (data) {
                    setFarmData(data);
                    setSelectedProvince(data.province || "");
                    setSelectedDistrict(data.district || "");
                    setSelectedSubDistrict(data.subdistrict || "");
                } else {
                    setIsCreating(true); // ✅ ถ้าไม่มีฟาร์ม ให้เปลี่ยนเป็น Create Mode
                    setIsEditable(true);
                }
            } catch (error) {
                console.error("Error fetching farm data:", error);
                setIsCreating(true);
                setIsEditable(true);
            }
        };
        fetchFarmData();
    }, []);

    // ✅ ดึงข้อมูลใบเซอร์ของฟาร์ม
    useEffect(() => {
        if (!farmData) return;
        const fetchCertificate = async () => {
            try {
                const cert = await getCertificateInfo(farmData.farmerID);
                setCertificateData(cert || null);
                
            } catch (error) {
                console.error("Error fetching certificate:", error);
                setCertificateData(null);
            }
        };
        fetchCertificate();
    }, [farmData]);

    // ✅ ดึง Districts เมื่อ Province เปลี่ยน
    useEffect(() => {
        if (selectedProvince && geoData.length > 0) {
            const filteredDistricts = [...new Set(
                geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
            )];
            setDistrictList(filteredDistricts);
            if (!filteredDistricts.includes(selectedDistrict)) {
                setSelectedDistrict(farmData?.district || "");
            }
        }
    }, [selectedProvince, geoData]);

    // ✅ ดึง Sub-Districts เมื่อ District เปลี่ยน
    useEffect(() => {
        if (selectedDistrict && geoData.length > 0) {
            const filteredSubDistricts = [...new Set(
                geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
            )];
            setSubDistrictList(filteredSubDistricts);
            if (!filteredSubDistricts.includes(selectedSubDistrict)) {
                setSelectedSubDistrict(farmData?.subdistrict || "");
            }
        }
    }, [selectedDistrict, geoData]);

    // ✅ อัปเดตค่า input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFarmData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // ✅ อัปเดตค่า select
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFarmData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveEditToggle = () => {
        setIsEditable(!isEditable);
    };

    // ✅ อัปโหลดไฟล์ใบเซอร์
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        await handleFileChange(event, setFileNames, setCertificateFile);
    };

    const handleCreateFarm = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // ✅ 1. ส่งข้อมูลไปที่ API `/create-farm`
            const newFarm = await createFarm(farmData);
            console.log("✅ [Create Farm] Success:", newFarm);

            // ✅ 2. อัปเดต Role และ EntityID (farmerID) ในตาราง users
            await updateUserRole(newFarm.email, "farmer", newFarm.farmerID);
            console.log("✅ [Update Role] User role updated to farmer");

            // ✅ 3. ปิดโหมด Create → เปลี่ยนเป็นโหมด Edit
            setFarmData(newFarm);
            setIsCreating(false);
            setIsEditable(false);

            // ✅ 4. เปลี่ยนไปหน้าหลักของ Farmer
        } catch (error) {
            console.error("❌ Error creating farm:", error);
        }
    };

    return (
        <div className="flex flex-col text-center w-full justify-center items-center h-full pt-20">
            {/* ✅ เปลี่ยนหัวข้อให้รองรับทั้ง Create และ Edit Mode */}
            <h1 className="text-3xl md:text-4xl font-bold my-4 md:my-8">
                {isCreating ? "Create Your Farm" : "General Information"}
            </h1>
    
            <div className="flex h-full w-11/12 md:w-8/12 p-4 md:p-5 shadow-xl justify-center items-center border rounded-2xl m-2 md:m-5">
                {/* ✅ ใช้ฟอร์มเดียวกัน */}
                <form className="flex flex-col gap-4 w-full" onSubmit={isCreating ? handleCreateFarm : handleUpdateFarm}>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 text-start w-full">

{/* Farm Name */}
<div className="flex flex-col text-start w-full">
    <label htmlFor="farmName" className="font-medium">Farm Name</label>
    <input
        type="text"
        id="farmName"
        name="farmName"
        className="border border-gray-300 rounded-md p-2 w-full"
        required
        disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
        value={farmData?.farmName || ""}
        onChange={handleInputChange}
    />
</div>

{/* First Name & Last Name */}
<div className="flex flex-col md:flex-row gap-4 md:gap-5 text-start w-full">
    <div className="flex flex-col text-start w-full md:w-6/12">
        <label htmlFor="fName" className="font-medium">First Name</label>
        <input
            type="text"
            id="fName"
            name="firstName"
            className="border border-gray-300 rounded-md p-2 w-full"
            required
            disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
            value={farmData?.firstName || ""}
            onChange={handleInputChange}
        />
    </div>
    <div className="flex flex-col text-start w-full md:w-6/12">
        <label htmlFor="lName" className="font-medium">Last Name</label>
        <input
            type="text"
            id="lName"
            name="lastName"
            className="border border-gray-300 rounded-md p-2 w-full"
            required
            disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
            value={farmData?.lastName || ""}
            onChange={handleInputChange}
        />
    </div>
</div>


{/* Email */}
<div className="flex flex-col text-start w-full">
    <label htmlFor="email" className="font-medium">Farm Email</label>
    <input
        type="email"
        id="email"
        name="email"
        className="border border-gray-300 rounded-full p-2"
        placeholder="Example@gmail.com"
        required
        disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
        value={farmData?.email || ""}
        onChange={handleInputChange}
    />
</div>


{/* Phone Number */}
<div className="flex flex-col text-start">
    <label htmlFor="tel" className="font-medium">Farm Phone Number</label>
    <div className="flex flex-col md:flex-row gap-2">
        {/* Area Code */}
        <div className="flex flex-col">
            <label htmlFor="areaCode" className="sr-only">Area Code</label>
            <select
                name="areaCode"
                id="areaCode"
                className="border border-gray-300 rounded-md p-2 w-full md:w-20 text-center"
                required
                disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
                value={farmData?.areaCode || "+66"}
                onChange={handleSelectChange}
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
            name="telephone"
            className="border border-gray-300 rounded-md p-2 flex-1 w-full"
            placeholder="Enter farm phone number"
            required
            disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
            value={farmData?.telephone || ""}
            onChange={handleInputChange}
        />
    </div>
</div>

{/* Address */}
<div className="flex flex-col text-start font-medium">
    <label htmlFor="address">Farm Address</label>
    <textarea
        name="address"
        id="address"
        className="border border-gray-300 rounded-md p-2 flex-1 w-full"
        placeholder="Enter farm address"
        required
        disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
        value={farmData?.address || ""}
        onChange={handleInputChange}
    ></textarea>
</div>


{/* Province */}
<div className="flex flex-col w-full text-start font-medium">
    <label htmlFor="province">Province</label>
    <select
        name="province"
        id="province"
        className="border border-gray-300 rounded-md p-2 text-center"
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
        disabled={!isCreating ? !isEditable : false} // ✅ ปรับเงื่อนไข
    >
        <option value="">Select province</option>
        {provinceList.map((prov, index) => (
            <option key={index} value={prov}>
                {prov}
            </option>
        ))}
    </select>
</div>


{/* District & Sub-District */}
<div className="flex flex-col md:flex-row w-full gap-4">
    {/* District */}
    <div className="flex flex-col text-start font-medium w-full md:w-6/12">
        <label htmlFor="district">District</label>
        <select
            name="district"
            id="district"
            className="border border-gray-300 rounded-md p-2 text-center"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince || (!isCreating && !isEditable)} // ✅ เงื่อนไขใหม่
        >
            <option value="">Select district</option>
            {districtList.map((dist, index) => (
                <option key={index} value={dist}>
                    {dist}
                </option>
            ))}
        </select>
    </div>

    {/* Sub-District */}
    <div className="flex flex-col text-start font-medium w-full md:w-6/12">
        <label htmlFor="subDistrict">Sub-District</label>
        <select
            name="subDistrict"
            id="subDistrict"
            className="border border-gray-300 rounded-md p-2 text-center"
            value={selectedSubDistrict}
            onChange={(e) => setSelectedSubDistrict(e.target.value)}
            disabled={!selectedDistrict || (!isCreating && !isEditable)} // ✅ เงื่อนไขใหม่
        >
            <option value="">Select sub-district</option>
            {subDistrictList.map((subDist, index) => (
                <option key={index} value={subDist}>
                    {subDist}
                </option>
            ))}
        </select>
    </div>
</div>

{/* Upload Organic Certification */}
<div className="flex flex-col md:flex-row items-center justify-start gap-2 border p-2">
    <label
        htmlFor="file-upload"
        className={`cursor-pointer px-4 py-2 bg-[#abc32f] text-white rounded-full hover:bg-[#607c3c] transition ${
            (!isCreating && !isEditable) && "opacity-50 cursor-not-allowed"
        }`}
    >
        Import file
    </label>
    <span className="text-sm text-gray-600">
        {fileNames.length > 1 ? `${fileNames.length} files selected` : fileNames[0]}
    </span>
    <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        disabled={!isCreating && !isEditable} // ✅ เงื่อนไขใหม่
    />
</div>

{/* ✅ แสดงข้อมูลใบเซอร์ (Certificate) เฉพาะใน Edit Mode ✅ */}
{!isCreating && (
    <div className="flex flex-col border p-2">
        <h3 className="font-medium">Certificates</h3>
        {certificateData && certificateData.length > 0 ? (
            certificateData.map((cert: any, index: number) => (
                <div key={index} className="flex justify-between items-center border p-2 my-2 rounded-md">
                    <a
                        href={`https://ipfs.io/ipfs/${cert.CertificationCID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        View Certificate {index + 1}
                    </a>

                    {/* ✅ แสดงปุ่มลบเฉพาะ Edit Mode */}
                    {isEditable && (
                        <button
                            type="button"
                            onClick={() => handleDeleteCertificate(farmData?.farmerID, setCertificateData)}
                            className="ml-4 bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))
        ) : (
            <div className="text-red-500">❌ No certificates available.</div>
        )}
    </div>
)}

{/* location */}
<div className="flex flex-col font-medium text-start">
    <label htmlFor="location">Location</label>
    <input
        type="text"
        name="location"
        id="location"
        className="border border-gray-300 rounded-full p-2 flex-1 w-full"
        placeholder="Enter a location"
        disabled={!isEditable || isCreating} // ❗ ปิดการแก้ไขในโหมด Create
        value={farmData?.location || ""}
        onChange={handleInputChange} // ✅ เพิ่ม onChange เพื่ออัปเดตค่า
    />
</div>


<button
    type="button"
    className="flex items-center justify-center text-md md:text-xl bg-[#abc32f] w-full md:w-1/6 rounded-full p-2 px-3 text-white self-center"
    onClick={async (event) => {
        event.preventDefault(); // ✅ ป้องกันการ reload หน้าเว็บ

        if (isCreating) {
            // ✅ กรณี Create Mode → ส่ง API ไปสร้างฟาร์ม
            await submitFarmData(
                farmData,
                certificateFile,
                certificateData,
                selectedDistrict,
                selectedSubDistrict,
                selectedProvince,
                setFarmData,
                setCertificateData,
                setCertificateFile,
                setFileNames
            );
        } else if (isEditable) {
            // ✅ กรณี Edit Mode → ส่ง API ไปอัปเดตฟาร์ม
            await updateFarmInfo(farmData);
            setIsEditable(false); // ปิด Edit Mode
        } else {
            handleSaveEditToggle(); // ✅ เปลี่ยนเป็น Edit Mode
        }
    }}
>
    {isCreating ? "Create Farm" : isEditable ? "Save" : "Edit"}
    {isCreating ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ml-2 w-6 h-6">
            <path fill="currentColor" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    ) : isEditable ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ml-2 w-6 h-6">
            <path fill="currentColor" d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1-3 3a3 3 0 0 1-3-3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
        </svg>
    )}
</button>


                </form>
            </div>
        </div>
    );
};

export default FarmGeneralInfo;
