import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080/api/v1/certifications";

// ✅ ดึงข้อมูลใบเซอร์ของฟาร์ม (แก้ไข endpoint ให้ใช้ entityID)
export const getCertificateInfo = async (entityID: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/entity/${entityID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch certificate info: ${response.status}`);
        }

        const data = await response.json();
        console.log("📌 [Frontend] Retrieved Certificate Data:", data);

        return Array.isArray(data) && data.length > 0 ? data : [];
    } catch (error) {
        console.error("❌ Error fetching certificate:", error);
        return [];
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

// ✅ ตรวจสอบว่า CID มีอยู่ใน Blockchain หรือไม่
export const checkUserCertification = async (certCID: string): Promise<boolean> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/check/${certCID}`);
        console.log("📌 Certification Check Response:", response.data);
        return response.data.exists;
    } catch (error: any) {
        console.error("❌ [ERROR] Checking certificate CID:", error.response?.data || error.message);
        return false;
    }
};

// ✅ ตรวจสอบว่ามีใบเซอร์อยู่แล้วหรือไม่ (ใช้ entityID)
const getExistingCertification = async (entityID: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/entity/${entityID}`);
        console.log("📌 [Check Certification] Existing Certificate Data:", response.data);
        return response.data.length > 0 ? response.data[0] : null; // ✅ คืนค่าใบเซอร์ล่าสุดถ้ามี
    } catch (error: any) {
        console.error("❌ [ERROR] Checking existing certification:", error.response?.data || error.message);
        return null;
    }
};

// ✅ สร้างหรืออัปเดตใบเซอร์ (จัดการใบเซอร์ที่หมดอายุ)
export const createOrUpdateCertificate = async (payload: {
    entityType: string;
    entityID: string;
    certificationCID: string;
    issuedDate: string;
    expiryDate: string;
}) => {
    try {
        if (!payload.entityID || !payload.certificationCID) {
            throw new Error("Missing required fields for certification update");
        }

        console.log("📌 Checking if CID exists before storing...");
        const isDuplicate = await checkUserCertification(payload.certificationCID);
        if (isDuplicate) {
            console.warn("⚠️ Certificate CID already exists on Blockchain");
            return null;
        }

        console.log("📌 Checking if Entity already has a Certification...");
        const existingCert = await getExistingCertification(payload.entityID);

        if (existingCert) {
            console.log("🔄 Existing Certificate found. Updating instead...");
            const updatePayload = { ...existingCert, certificationCID: payload.certificationCID };
            const updateResponse = await axios.put(`${API_BASE_URL}/update`, updatePayload);
            console.log("✅ Certification updated successfully:", updateResponse.data);
            return updateResponse.data;
        }

        // ✅ ถ้ายังไม่มี → สร้างใหม่
        console.log("📌 No existing certificate. Creating a new one...");
        const response = await axios.post(`${API_BASE_URL}/create`, payload);
        console.log("✅ Certification created:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [ERROR] Creating/updating certification:", error.response?.data || error.message);
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

