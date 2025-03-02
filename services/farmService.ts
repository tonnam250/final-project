const API_URL = "http://127.0.0.1:8080/api/v1/farmers";

import {
    uploadCertificate,
} from "./certificateService";

// ✅ ฟังก์ชันอัปเดตข้อมูลฟาร์ม
export const updateFarmInfo = async (farmData: any) => {
    try {
        const response = await api.put("/farmer/update", farmData);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating farm:", error);
        throw error;
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



// ✅ ฟังก์ชันสร้างฟาร์มใหม่
export const createFarm = async (farmData: any): Promise<any | null> => {
    try {
        // ✅ ใช้ `FormData` เพื่อส่งไป Backend
        const formData = new FormData();
        formData.append("farmName", farmData.farmName);
        formData.append("email", farmData.email);
        formData.append("address", farmData.address);
        formData.append("district", farmData.district);
        formData.append("subdistrict", farmData.subdistrict); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("province", farmData.province);
        formData.append("phone", farmData.phone); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("areaCode", farmData.areaCode); // ✅ ตรวจสอบค่าก่อนส่ง
        formData.append("location_link", farmData.location); // ✅ แก้ไขให้ตรงกับ backend
        formData.append("cert_cid", farmData.certCID); // ✅ แก้ไขให้ตรงกับ backend

        console.log("📌 Final FormData before sending:", formData);

        // ✅ ส่งข้อมูลไปที่ Backend (แก้ URL)
        const response = await fetch(`${API_URL}/create`, {
            method: "POST",
            credentials: "include",
            body: formData,
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


