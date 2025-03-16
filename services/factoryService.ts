import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/factories`;
// ... ใช้ API_URL


import {
    uploadCertificate,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลโรงงาน
export const updateFactoryInfo = async (factoryData: any) => {
    try {
        const formData = new FormData();
        formData.append("factoryName", factoryData?.factoryName || "");
        formData.append("address", factoryData?.address || "");
        formData.append("district", factoryData?.district || "");
        formData.append("subdistrict", factoryData?.subdistrict || "");
        formData.append("province", factoryData?.province || "");
        formData.append("postCode", factoryData?.postCode || "");
        formData.append("phone", factoryData?.telephone || "");
        formData.append("areaCode", factoryData?.areaCode || "");
        formData.append("location_link", factoryData?.location || "");

        console.log("📌 [DEBUG] Sending updateFactoryInfo → FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = await fetch(`${API_URL}/`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Updating factory failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error updating factory:", error);
        throw error;
    }
};

export const getFactoryInfo = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            console.warn("🚨 User is not a factory owner (403 Forbidden)");
            return null;
        }

        if (response.status === 404) {
            console.warn("🚨 No factory found (404 Not Found)");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Fetching factory data failed: ${response.status}`);
        }

        const data = await response.json();

        // ✅ แปลงชื่อ property ให้ตรงกับ React
        return {
            factoryName: data.factoryName,  // ✅ ตรงกับ React
            email: data.email,
            address: data.address,
            district: data.district,
            subdistrict: data.subdistrict,
            province: data.province,
            telephone: data.telephone,
            areaCode: data.areaCode,
            location: data.location_link,  // ✅ ตรงกับ React
        };
    } catch (error) {
        console.error("❌ [ERROR] Fetching factory data failed:", error);
        return null;
    }
};

// ✅ ฟังก์ชันสร้างโรงงานใหม่
export const createFactory = async (factoryData: any): Promise<any | null> => {
    try {
        // ✅ ใช้ `FormData` เพื่อส่งไป Backend
        const formData = new FormData();
        formData.append("factoryName", factoryData.factoryName);
        formData.append("email", factoryData.email);
        formData.append("address", factoryData.address);
        formData.append("district", factoryData.district);
        formData.append("subdistrict", factoryData.subdistrict); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("province", factoryData.province);
        formData.append("phone", factoryData.phone); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("areaCode", factoryData.areaCode); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("location_link", factoryData.location); // ✅ แก้ไขให้ตรงกับ backend
        formData.append("cert_cid", factoryData.certCID); // ✅ แก้ไขให้ตรงกับ backend

        console.log("📌 Final FormData before sending:", formData);

        // ✅ ส่งข้อมูลไปที่ Backend (แก้ URL)
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to create factory: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Factory created successfully:", result);

        return result;
    } catch (error) {
        console.error("❌ [ERROR] Creating factory failed:", error);
        alert("เกิดข้อผิดพลาดขณะสร้างโรงงาน");
        return null;
    }
};
