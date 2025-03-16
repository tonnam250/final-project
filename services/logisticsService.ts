import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/logistics`;

import {
    uploadCertificate,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลโลจิสติก
export const updateLogisticsInfo = async (logisticsData: any) => {
    try {
        const formData = new FormData();
        formData.append("logisticsName", logisticsData?.logisticsName || "");
        formData.append("address", logisticsData?.address || "");
        formData.append("district", logisticsData?.district || "");
        formData.append("subdistrict", logisticsData?.subdistrict || "");
        formData.append("province", logisticsData?.province || "");
        formData.append("postCode", logisticsData?.postCode || "");
        formData.append("phone", logisticsData?.telephone || "");
        formData.append("areaCode", logisticsData?.areaCode || "");
        formData.append("location_link", logisticsData?.location || "");

        console.log("📌 [DEBUG] Sending updateLogisticsInfo → FormData:");
        for (const pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = await fetch(`${API_URL}/`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Updating logistics failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error updating logistics:", error);
        throw error;
    }
};

export const getLogisticsInfo = async (): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 403) {
            console.warn("🚨 User is not a logistics provider (403 Forbidden)");
            return null;
        }

        if (response.status === 404) {
            console.warn("🚨 No logistics company found (404 Not Found)");
            return null;
        }

        if (!response.ok) {
            throw new Error(`Fetching logistics data failed: ${response.status}`);
        }

        const data = await response.json();

        // ✅ แปลงชื่อ property ให้ตรงกับ React
        return {
            logisticsName: data.logisticsName,  // ✅ ตรงกับ React
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
        console.error("❌ [ERROR] Fetching logistics data failed:", error);
        return null;
    }
};

// ✅ ฟังก์ชันสร้างบริษัทโลจิสติกส์ใหม่
export const createLogistics = async (logisticsData: any): Promise<any | null> => {
    try {
        // ✅ ใช้ `FormData` เพื่อส่งไป Backend
        const formData = new FormData();
        formData.append("logisticsName", logisticsData.logisticsName);
        formData.append("email", logisticsData.email);
        formData.append("address", logisticsData.address);
        formData.append("district", logisticsData.district);
        formData.append("subdistrict", logisticsData.subdistrict); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("province", logisticsData.province);
        formData.append("phone", logisticsData.phone); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("areaCode", logisticsData.areaCode); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("location_link", logisticsData.location); // ✅ แก้ไขให้ตรงกับ backend
        formData.append("cert_cid", logisticsData.certCID); // ✅ แก้ไขให้ตรงกับ backend

        console.log("📌 Final FormData before sending:", formData);

        // ✅ ส่งข้อมูลไปที่ Backend (แก้ URL)
        const response = await fetch(`${API_URL}/`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`❌ Failed to create logistics company: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Logistics company created successfully:", result);

        return result;
    } catch (error) {
        console.error("❌ [ERROR] Creating logistics company failed:", error);
        alert("เกิดข้อผิดพลาดขณะสร้างบริษัทโลจิสติกส์");
        return null;
    }
};
