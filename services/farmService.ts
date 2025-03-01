const API_URL = "http://127.0.0.1:8080/api/v1/farmers";

import {
    uploadCertificate,
    createOrUpdateCertificate,
    checkUserCertification,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลฟาร์ม
export const updateFarmInfo = async (farmData: any): Promise<any | null> => {
    try {
        console.log("📡 [UpdateFarmInfo] Updating farm data...");

        // ✅ สร้าง Payload ที่ส่งไป Backend
        const payload = {
            companyName: farmData?.companyName, // ✅ ใช้ companyName แทน firstName + lastName
            email: farmData?.email,
            address: farmData?.address,
            district: farmData?.district,
            subdistrict: farmData?.subdistrict,
            province: farmData?.province,
            phone: farmData?.telephone,
            areaCode: farmData?.areaCode,
            location_link: farmData?.location,
            cert_file: farmData?.cert_file || "",
            country: farmData?.country || "",  // ✅ เพิ่ม country
            postCode: farmData?.postCode || "", // ✅ เพิ่ม postCode
            lineID: farmData?.lineID || "", // ✅ เพิ่ม lineID
            facebook: farmData?.facebook || "", // ✅ เพิ่ม facebook
        };

        console.log("📌 [UpdateFarmInfo] Sending data:", payload);

        const response = await fetch(`${API_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to update farm data: ${response.status}`);
        }

        console.log("✅ [UpdateFarmInfo] Farm data updated successfully");
        return await response.json();
    } catch (error) {
        console.error("❌ [ERROR] Updating farm data failed:", error);
        return null;
    }
};

// ✅ ดึงข้อมูลฟาร์ม
export const getFarmInfo = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            console.warn("🚨 User is not a farmer (403 Forbidden)");
            return null; // ✅ ให้ค่า null แทน Error
        }

        if (response.status === 404) {
            console.warn("🚨 No farm found (404 Not Found)");
            return null; // ✅ ให้ค่า null แทน Error
        }

        if (!response.ok) {
            throw new Error(`Fetching farm data failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ [ERROR] Fetching farm data failed:", error);
        return null; // ✅ ให้ค่า null แทน Error
    }
};


// ✅ อัปเดตข้อมูลฟาร์มและใบเซอร์
export const submitFarmData = async (
    farmData: any,
    certificateFile: File | null,
    certificateData: any,
    selectedDistrict: string,
    selectedSubDistrict: string,
    selectedProvince: string,
    setFarmData: React.Dispatch<React.SetStateAction<any>>,
    setCertificateData: React.Dispatch<React.SetStateAction<any | null>>,
    setCertificateFile: React.Dispatch<React.SetStateAction<File | null>>,
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>,
    isCreating: boolean // ✅ เพิ่มตัวแปรเช็คว่าเป็น Create Mode หรือไม่
) => {
    let certCID = certificateData?.cid || "";

    if (certificateFile) {
        try {
            console.log("📌 Uploading certificate file:", certificateFile.name);
            const uploadResult = await uploadCertificate(certificateFile);

            if (uploadResult) {
                certCID = uploadResult;
                console.log("📌 Received CID from IPFS:", certCID);
                setCertificateData({ cid: certCID });
                setCertificateFile(null);
                setFileNames(["No file selected."]);
            } else {
                alert("❌ อัปโหลดใบเซอร์ไม่สำเร็จ");
                return;
            }
        } catch (error) {
            console.error("❌ Error uploading certificate:", error);
            alert("เกิดข้อผิดพลาดขณะอัปโหลดใบเซอร์");
            return;
        }
    }

    // ✅ ถ้าเป็น Create Mode → เรียก `createFarm()`
    if (isCreating) {
        try {
            console.log("🚀 [Create Mode] Calling `createFarm()`...");
            const newFarm = await createFarm(farmData, certificateFile);
            if (newFarm) {
                console.log("✅ [Create Farm] Success:", newFarm);
                setFarmData(newFarm);
                alert("✅ ฟาร์มถูกสร้างเรียบร้อยแล้ว!");
            } else {
                alert("❌ สร้างฟาร์มไม่สำเร็จ");
            }
        } catch (error) {
            console.error("❌ Error creating farm:", error);
            alert("เกิดข้อผิดพลาดขณะสร้างฟาร์ม");
        }
        return;
    }

    // ✅ ถ้าไม่ใช่ Create Mode → เรียก `updateFarmInfo()`
    console.log("📡 [Update Mode] Calling `updateFarmInfo()`...");
    try {
        const result = await updateFarmInfo({
            firstname: farmData?.firstName,
            lastname: farmData?.lastName,
            email: farmData?.email,
            address: farmData?.address,
            district: selectedDistrict,
            subdistrict: selectedSubDistrict,
            province: selectedProvince,
            phone: farmData?.telephone,
            areaCode: farmData?.areaCode,
            location_link: farmData?.location,
            cert_file: certCID,
        });

        if (result) {
            console.log("✅ [Update Farm] Success:", result);
            setFarmData(result);
            alert("✅ อัปเดตข้อมูลฟาร์มสำเร็จ!");
        } else {
            alert("❌ อัปเดตข้อมูลฟาร์มไม่สำเร็จ");
        }
    } catch (error) {
        console.error("❌ Error updating farm information:", error);
        alert("เกิดข้อผิดพลาดขณะอัปเดตข้อมูลฟาร์ม");
    }
};

// ✅ ฟังก์ชันสร้างฟาร์มใหม่
export const createFarm = async (farmData: any, certificateFile: File | null): Promise<any | null> => {
    try {
        let certCID = "";

        // ✅ ถ้ามีไฟล์ใบเซอร์ → อัปโหลดไปยัง IPFS ก่อน
        if (certificateFile) {
            console.log("📌 Uploading certificate file:", certificateFile.name);
            const uploadResult = await uploadCertificate(certificateFile);

            if (uploadResult) {
                certCID = uploadResult;
                console.log("📌 Received CID from IPFS:", certCID);
            } else {
                throw new Error("❌ อัปโหลดใบเซอร์ไม่สำเร็จ");
            }
        }

        // ✅ ตรวจสอบว่า CID นี้มีอยู่บน Blockchain หรือไม่
        if (certCID) {
            console.log("📌 Checking if certification CID exists on Blockchain...");
            const isDuplicate = await checkUserCertification(certCID);
            if (isDuplicate) {
                alert("⚠️ CID ของใบเซอร์นี้มีอยู่แล้วในระบบ Blockchain!");
                return null;
            }
        }

        // ✅ สร้าง Payload สำหรับ API `/create-farm`
        const payload = {
            farmName: farmData?.farmName || "",
            email: farmData?.email || "",
            address: farmData?.address || "",
            district: farmData?.district || "",
            subdistrict: farmData?.subdistrict || "",
            province: farmData?.province || "",
            phone: farmData?.telephone || "",
            areaCode: farmData?.areaCode || "",
            location_link: farmData?.location || "",
            cert_file: certificateFile || null,
            country: farmData?.country || "",
            postCode: farmData?.postCode || "",
            lineID: farmData?.lineID || "",
            facebook: farmData?.facebook || "",
        };
        
        console.log("📌 Sending farm creation data to Backend:", payload);

        // ✅ ส่งข้อมูลไปยัง API `/create-farm`
        console.log("📌 [CreateFarm] Final Payload Before Sending:", payload);
        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to create farm: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Farm created successfully:", result);

        return result;
    } catch (error) {
        console.error("❌ [ERROR] Creating farm failed:", error);
        alert("เกิดข้อผิดพลาดขณะสร้างฟาร์ม");
        return null;
    }
};
