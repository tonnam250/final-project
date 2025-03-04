"use client";

import { useState, useEffect } from "react";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";
import { updateUserRole } from "@/services/authService"; // ✅ ใช้ updateUserRole
import { getLogisticsInfo, updateLogisticsInfo, createLogistics } from "@/services/logisticsService"; // ✅ เปลี่ยนจากโรงงานเป็นโลจิสติกส์
import { getUserCertifications, uploadCertificateAndCheck, handleDeleteCertificate, deleteCertificate, storeCertification } from "@/services/certificateService";
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


const GeneralInfo = () => {
    const [logisticsData, setLogisticsData] = useState<any>({});
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certificateData, setCertificateData] = useState<any[]>([]);
    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [certificatesToDelete, setCertificatesToDelete] = useState<string[]>([]);

    // ✅ ตรวจสอบว่าผู้ใช้มีโลจิสติกส์หรือยัง
useEffect(() => {
    const fetchLogisticsData = async () => {
        try {
            const data = await getLogisticsInfo();
            console.log("📌 Logistics Data:", data); // ✅ ตรวจสอบว่ามีข้อมูลโลจิสติกส์หรือไม่

            if (data) {
                setLogisticsData(data);
                setSelectedProvince(data.province || "");
                setSelectedDistrict(data.district || "");
                setSelectedSubDistrict(data.subdistrict || "");
                setIsCreating(false);
                setIsEditable(false);
            } else {
                console.warn("🚨 No logistics company found → Switching to Create Mode");
                setIsCreating(true);
                setIsEditable(true);
            }
        } catch (error) {
            console.error("❌ Error fetching logistics data:", error);
            setIsCreating(true);
            setIsEditable(true);
        }
    };

    const fetchCertificates = async () => {
        try {
            const data = await getUserCertifications();
            setCertificateData(data);
        } catch (error) {
            console.error("❌ Error fetching certification data:", error);
        }
    };

    fetchLogisticsData();
    fetchCertificates();
}, []);

useEffect(() => {
    console.log("🔄 Updated isCreating:", isCreating);
    console.log("🔄 Updated isEditable:", isEditable);
    console.log("🛠 DEBUG → logisticsData:", logisticsData);
}, [isCreating, isEditable]);    


// ✅ ดึงข้อมูลภูมิศาสตร์
useEffect(() => {
    const fetchGeoData = async () => {
        const data = await getGeoData();
        setGeoData(data);
        setProvinceList(getProvinceList(data)); // ✅ ใช้ geoService
    };
    fetchGeoData();
}, []);

// ✅ ดึง Districts เมื่อ Province เปลี่ยน
useEffect(() => {
    if (selectedProvince && geoData.length > 0) {
        const filteredDistricts = [...new Set(
            geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
        )];
        setDistrictList(filteredDistricts);
        if (!filteredDistricts.includes(selectedDistrict)) {
            setSelectedDistrict(logisticsData?.district || "");
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
            setSelectedSubDistrict(logisticsData?.subdistrict || "");
        }
    }
}, [selectedDistrict, geoData]);

// ✅ ดึงข้อมูลใบเซอร์ของโลจิสติกส์
useEffect(() => {
    if (!logisticsData || !logisticsData.logisticsID) return;
    const fetchCertificate = async () => {
        try {
            const cert = await getUserCertifications();
            console.log("📌 [DEBUG] Loaded Certificates:", cert);
            setCertificateData(cert || []);
        } catch (error) {
            console.error("❌ Error fetching certificate:", error);
            setCertificateData([]);
        }
    };
    fetchCertificate();
}, [logisticsData]);

useEffect(() => {
    if (!logisticsData) return;

    setLogisticsData((prevData: any) => ({
        ...prevData,
        province: selectedProvince || "",  // ✅ บันทึกลง `logisticsData`
        district: selectedDistrict || "",
        subdistrict: selectedSubDistrict || "",
    }));

    console.log("📌 Updated logisticsData (Province/District/Sub-District):", {
        province: selectedProvince,
        district: selectedDistrict,
        subdistrict: selectedSubDistrict,
    });
}, [selectedProvince, selectedDistrict, selectedSubDistrict]);

// ✅ อัปเดตค่า input
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!logisticsData) return;
    const { name, value } = e.target;

    setLogisticsData((prevData: any) => {
        if (!prevData) prevData = {};
        return {
            ...prevData,
            [e.target.name]: e.target.value.trim(),
        };
    });
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!logisticsData) return;
    const { name, value } = e.target;

    setLogisticsData((prevData: any) => {
        const updatedData = {
            ...prevData,
            [name]: value,
        };

        console.log("📌 Updated logisticsData (Select):", updatedData);
        return updatedData;
    });

    // ✅ ถ้าเลือก Area Code ให้บันทึกลง `logisticsData.areaCode`
    if (name === "areaCode") {
        setLogisticsData((prevData: any) => ({
            ...prevData,
            areaCode: value,
        }));
    }
};

const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log("📌 Selected file:", file.name);
    setFileNames([file.name]);
    setCertificateFile(file);

    // ✅ อัปโหลดและตรวจสอบใบเซอร์
    const certCID = await uploadCertificateAndCheck(file);
    if (!certCID) {
        console.error("🚨 Certificate already used. Please upload a new one.");
        alert("❌ ใบเซอร์นี้ถูกใช้ไปแล้ว กรุณาใช้ใบเซอร์ใหม่");
        setFileNames(["No file selected."]);
        setCertificateFile(null);
        return;
    }

    console.log("✅ Certificate uploaded successfully, CID:", certCID);
};

const handleSaveEditToggle = () => {
    if (isCreating) {
        setIsEditable(true); // ✅ ถ้าเป็น Create Mode บังคับให้ `isEditable = true`
    } else {
        setIsEditable(!isEditable);
    }
};

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const files = Array.from(event.target.files).map((file) => file.name);
        setFileNames(files.length ? files : ["ยังไม่ได้เลือกไฟล์"]);
    } else {
        setFileNames(["ยังไม่ได้เลือกไฟล์"]);
    }
};

const handleCreateLogistics = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!logisticsData) {
        console.error("🚨 LogisticsData is missing");
        return;
    }

    if (!certificateFile) {
        alert("❌ กรุณาอัปโหลดใบเซอร์ก่อนสร้างบริษัทโลจิสติกส์");
        return;
    }

    console.log("📌 Uploading certificate...");
    const certCID = await uploadCertificateAndCheck(certificateFile);
    if (!certCID) {
        console.error("🚨 Certificate check failed. Cannot create logistics company.");
        return;
    }

    // ✅ ตรวจสอบค่า `subDistrict`, `areaCode`, `phone` ให้แน่ใจว่าไม่เป็น `undefined`
    const cleanLogisticsData = {
        logisticsName: logisticsData.logisticsName || "",
        email: logisticsData.email || "",
        address: logisticsData.address || "",
        district: logisticsData.district || "",
        subdistrict: logisticsData.subdistrict || "", // ✅ แก้ `undefined` เป็น `""`
        province: logisticsData.province || "",
        phone: logisticsData.telephone || "", // ✅ แก้ `undefined` เป็น `""`
        areaCode: logisticsData.areaCode || "", // ✅ แก้ `undefined` เป็น `""`
        location: logisticsData.location || "",
        certCID: certCID, // ✅ ใส่ certCID ที่ได้จาก IPFS
    };

    console.log("📌 Creating logistics company with cleaned data:", cleanLogisticsData);

    const response = await createLogistics(cleanLogisticsData);
    if (!response) {
        console.error("🚨 Failed to create logistics company.");
        return;
    }

    console.log("✅ Logistics company created successfully:", response);
    setIsCreating(false);
    setIsEditable(false);
};

const handleUpdateLogistics = async (event: React.FormEvent) => {
    event.preventDefault();
    let logisticsUpdateSuccess = false;
    let certTxHash: string | null = null;

    try {
        console.log("📌 Updating logistics company data...");
        const payload = {
            logisticsName: logisticsData?.logisticsName || "",
            address: logisticsData?.address || "",
            district: logisticsData?.district || "",
            subdistrict: logisticsData?.subdistrict || "",
            province: logisticsData?.province || "",
            postCode: logisticsData?.postCode || "",
            telephone: logisticsData?.telephone || "",
            areaCode: logisticsData?.areaCode || "",
            location_link: logisticsData?.location || "",
        };

        console.log("📌 [UpdateLogistics] Sending data:", payload);
        await updateLogisticsInfo(payload);
        logisticsUpdateSuccess = true;
        console.log("✅ [Update Logistics] Success");
    } catch (error) {
        console.error("❌ Error updating logistics company:", error);
    }

    // ✅ อัปเดตใบเซอร์บน Blockchain (เฉพาะใบเซอร์ที่อัปโหลดใหม่)
    if (certificateFile) {
        console.log("📌 Uploading new certificate...");
        const certCID = await uploadCertificateAndCheck(certificateFile);
        console.log("📌 [DEBUG] certCID received from IPFS:", certCID);

        if (!certCID) {
            console.error("🚨 Certificate check failed. Cannot update certification.");
        } else {
            console.log("📌 Storing new certification on Blockchain...");
            try {
                certTxHash = await storeCertification(certCID);
                console.log("✅ Certification stored successfully:", certTxHash);
            } catch (error) {
                console.error("❌ [ERROR] Failed to store certification on blockchain:", error);
            }
        }
    }

    // ✅ ลบใบเซอร์จาก Blockchain (ถ้ามีรายการรอลบ)
    if (certificatesToDelete.length > 0) {
        console.log(`📌 Deleting ${certificatesToDelete.length} Certificates from Blockchain...`);

        await Promise.all(
            certificatesToDelete.map(async (eventID) => {
                if (!eventID) {
                    console.warn("🚨 [WARNING] Skipping deletion because eventID is missing!");
                    return;
                }
                console.log(`📌 Deleting Certificate from Blockchain: ${eventID}`);
                await deleteCertificate(eventID);
            })
        );

        console.log("✅ All selected certificates deleted.");
    } else {
        console.log("ℹ️ No certificates marked for deletion.");
    }

    // ✅ รีโหลดข้อมูลใหม่หลังจากอัปเดตเสร็จ
    console.log("📌 Fetching updated logistics and certification data...");
    const [updatedLogistics, updatedCertificates] = await Promise.all([
        getLogisticsInfo(),
        getUserCertifications(),
    ]);

    console.log("✅ [Update Logistics] Reloaded Data:", updatedLogistics);
    console.log("✅ [Reload Certificates]", updatedCertificates);

    setLogisticsData(updatedLogistics);
    setCertificateData(updatedCertificates);
    setCertificatesToDelete([]);

    if (logisticsUpdateSuccess) {
        setIsEditable(false);
    }
};


    return (
        <div className="flex flex-col text-center w-full justify-center items-center h-full pt-20">
            <h1 className="text-3xl md:text-4xl font-bold my-4 md:my-8">{isCreating ? "Create Your Logistics Profile" : "General Information"}</h1>
            <div className="flex h-full w-11/12 md:w-8/12 p-4 md:p-5 shadow-xl justify-center items-center border rounded-2xl m-2 md:m-5">
                    <form className="flex flex-col gap-4 w-full" onSubmit={isCreating ? handleCreateLogistics : handleUpdateLogistics}>

                        {/* Logistics Company Name */}
<div className="flex flex-col text-start w-full">
    <label htmlFor="logisticsName" className="font-medium">Logistics Company Name</label>
    <input
        type="text"
        id="logisticsName"
        name="logisticsName"
        className="border border-gray-300 rounded-full p-2 w-full" 
        required
        disabled={!isCreating && !isEditable}
        value={logisticsData?.logisticsName || ""}
        onChange={handleInputChange}
    />
</div>


                    {/* email */}
                    <div className="flex flex-col text-start w-full">
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="border border-gray-300 rounded-full p-2"
                            placeholder="Example@gmail.com"
                            required
                            disabled={!isCreating && !isEditable}
                            value={logisticsData?.email || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* end email */}

                    {/* Phone Number */}
                    <div className="flex flex-col text-start">
                        <label htmlFor="tel" className="font-medium">Phone Number</label>
                        <div className="flex flex-col md:flex-row gap-2">

                            {/* Area Code */}
                            <div className="flex flex-col">
                                <label htmlFor="areaCode" className="sr-only">Area Code</label>
                                <select
                                    name="areaCode"
                                    id="areaCode"
                                    className="border border-gray-300 rounded-full p-2 w-full md:w-20 text-center"
                                    required
                                    disabled={!isCreating && !isEditable}
                                    value={logisticsData?.areaCode || "+66"}
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
                                className="border border-gray-300 rounded-full p-2 flex-1 w-full"
                                placeholder="Enter your phone number"
                                required
                                disabled={!isCreating && !isEditable}
                                value={logisticsData?.telephone || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    {/* end Phone number */}

                    {/* Address */}
                    <div className="flex flex-col text-start font-medium">
                        <label htmlFor="address">Address</label>
                        <textarea name="address" id="address" className="border border-gray-300 rounded-2xl p-2 flex-1 w-full" disabled={!isCreating && !isEditable}
        value={logisticsData?.address || ""}
        onChange={handleInputChange}></textarea>
                    </div>
                    {/* end Address */}

                    {/* province */}
                    <div className="flex flex-col w-full text-start font-medium">
                        <label htmlFor="province">Province</label>
                        <select name="province" id="province" className="border border-gray-300 rounded-full p-2 text-center"
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            disabled={!isCreating && !isEditable}>
                            <option value="">Select province</option>
                            {provinceList.map((prov, index) => (
                                <option key={index} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* end province */}

                    {/* district + Sub-District */}
                    <div className="flex flex-col md:flex-row w-full gap-4">
                        <div className="flex flex-col text-start font-medium w-full md:w-6/12">
                            <label htmlFor="district">District</label>
                            <select name="district" id="district" className="border border-gray-300 rounded-full p-2 text-center"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedProvince || !isCreating && !isEditable}>
                                <option value="">Select district</option>
                                {districtList.map((dist, index) => (
                                    <option key={index} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col text-start font-medium w-full md:w-6/12">
                            <label htmlFor="subDistrict">Sub-District</label>
                            <select name="subDistrict" id="subDistrict" className="border border-gray-300 rounded-full p-2 text-center"
                                value={selectedSubDistrict}
                                onChange={(e) => setSelectedSubDistrict(e.target.value)}
                                disabled={!selectedDistrict || !isCreating && !isEditable}>
                                <option value="">Select sub-district</option>
                                {subDistrictList.map((subDist, index) => (
                                    <option key={index} value={subDist}>
                                        {subDist}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* end district + sub-district */}

                    <label htmlFor="" className="font-semibold text-start">Upload Certification</label>
{/* Upload Logistics Certification */}
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
        disabled={!isCreating && !isEditable}
    />
</div>

{/* ✅ แสดงข้อมูลใบเซอร์ (Certificate) เฉพาะใน Edit Mode ✅ */}
{!isCreating && (
    <div className="flex flex-col border p-2">
        <h3 className="font-medium">Logistics Certificates</h3>
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
                            onClick={() => handleDeleteCertificate(
                                cert.EventID, 
                                setCertificatesToDelete, // ✅ ส่งไปอัปเดตรายการใบเซอร์ที่ต้องลบ
                                setCertificateData // ✅ ส่งไปซ่อนใบเซอร์ออกจาก UI ชั่วคราว
                            )}
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
                            disabled={!isCreating && !isEditable}
                            value={logisticsData?.location || ""}
                            onChange={handleInputChange} // ✅ เพิ่ม onChange เพื่ออัปเดตค่า
                        />

                        {/* <MapProvider>
                            <MapComponent center={mapCenter} />
                        </MapProvider> */}
                    </div>

                    <button
    type="button"
    className="flex items-center justify-center text-md md:text-xl bg-[#abc32f] w-full md:w-1/6 rounded-full p-2 px-3 text-white self-center"
    onClick={async (event) => {
        event.preventDefault(); // ✅ ป้องกันการ reload หน้าเว็บ
        if (isCreating) {
            await handleCreateLogistics(event); // ✅ เรียกฟังก์ชันสร้างโลจิสติกส์โดยตรง
        } else if (isEditable) {
            await handleUpdateLogistics(event); // ✅ เรียกฟังก์ชันอัปเดตโลจิสติกส์โดยตรง
            setIsEditable(false);
        } else {
            handleSaveEditToggle();
        }
    }}
>
    {isCreating ? "Create Logistics" : isEditable ? "Save" : "Edit"}
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
            </div >
        </div >
    );
};

export default GeneralInfo;