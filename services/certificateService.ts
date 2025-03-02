import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080/api/v1/certifications";

// ✅ ดึงใบเซอร์ของฟาร์มของผู้ใช้ที่ล็อกอินอยู่
export const getUserCertifications = async (includeExpired: boolean = false) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
            params: { includeExpired }, // ✅ ใช้ Query Param เพื่อเลือกดูเฉพาะ Active หรือทั้งหมด
            withCredentials: true, // ✅ ส่ง Cookie/JWT เพื่อยืนยันตัวตน
        });
        return response.data.certifications; // ✅ ส่งข้อมูลใบเซอร์กลับไป
    } catch (error: any) {
        console.error("❌ Error fetching user certifications:", error.response?.data || error.message);
        throw error;
    }
};


// ✅ อัปโหลดไฟล์ใบเซอร์ไป IPFS และคืนค่า CID
export const uploadCertificate = async (file: File): Promise<string | null> => {
    try {
        if (!file) throw new Error("No file provided for upload");

        const formData = new FormData();
        formData.append("file", file);

        console.log("📌 DEBUG - Uploading File:", file.name);

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("📌 DEBUG - IPFS Response:", response.data);
        return response.data.cid;
    } catch (error: any) {
        console.error("❌ [ERROR] Uploading certificate:", error.response?.data || error.message);
        return null;
    }
};

export const uploadCertificateAndCheck = async (certificateFile: File): Promise<string | null> => {
    try {
        console.log("📌 Uploading certificate file:", certificateFile.name);
        const uploadResult = await uploadCertificate(certificateFile);

        if (!uploadResult) {
            throw new Error("❌ อัปโหลดใบเซอร์ไม่สำเร็จ");
        }

        console.log("📌 Received CID from IPFS:", uploadResult);

        // ✅ ตรวจสอบ `certCID` ซ้ำทันทีหลังจากอัปโหลด
        const certCheckResponse = await fetch(`${API_BASE_URL}/check/${uploadResult}`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (!certCheckResponse.ok) {
            throw new Error("❌ ตรวจสอบใบเซอร์ล้มเหลว");
        }

        const certCheckData = await certCheckResponse.json();
        console.log("📌 Cert Check Result:", certCheckData);

        if (certCheckData.exists) {
            console.error("🚨 ใบเซอร์นี้เคยถูกใช้แล้ว → ไม่อนุญาตให้อัปโหลดใหม่");
            alert("❌ ใบเซอร์นี้ถูกใช้ไปแล้ว กรุณาใช้ใบเซอร์ใหม่");
            return null;
        }

        return uploadResult; // ✅ ส่ง `certCID` กลับไปใช้ต่อ
    } catch (error) {
        console.error("❌ [ERROR] Upload & Check Certificate Failed:", error);
        alert("❌ อัปโหลดใบเซอร์ล้มเหลว หรือใบเซอร์นี้เคยถูกใช้แล้ว");
        return null;
    }
};


// ✅ ลบใบเซอร์ (Soft Delete)
export const deleteCertificate = async (entityID: string, eventID: string) => {
    try {
        if (!entityID || !eventID) throw new Error("Entity ID and Event ID are required for deleting certificate");

        const response = await axios.delete(`${API_BASE_URL}/${entityID}`, {
            data: { event_id: eventID }, // ✅ ส่ง eventID ผ่าน JSON Body
        });

        console.log("✅ Certification deleted:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [ERROR] Deleting certificate:", error.response?.data || error.message);
        return null;
    }
};

export const handleDeleteCertificate = async (
    entityID: string,
    eventID: string,
    setCertificateData: React.Dispatch<React.SetStateAction<any[]>>
) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบใบเซอร์นี้?");
    if (!confirmDelete) return;

    console.log("📌 [DEBUG] Deleting certificate with Event ID:", eventID);

    const result = await deleteCertificate(entityID, eventID);
    if (result) {
        setCertificateData((prevData = []) => {
            console.log("📌 [DEBUG] Current Certificate Data Before Delete:", prevData);
            const updatedData = prevData.filter((cert) => cert.event_id !== eventID);
            console.log("📌 [DEBUG] Updated Certificate Data After Delete:", updatedData);
            return updatedData;
        });
        alert("✅ ใบเซอร์ถูกลบเรียบร้อยแล้ว");
    } else {
        alert("❌ ลบใบเซอร์ไม่สำเร็จ");
    }
};

