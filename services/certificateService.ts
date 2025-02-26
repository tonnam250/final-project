import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080/api/v1/certifications";

// ✅ ดึงข้อมูลใบเซอร์ของฟาร์ม
export const getCertificateInfo = async (farmerID: string) => {
  try {
      const response = await fetch(`${API_BASE_URL}/certifications/${farmerID}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch certificate info: ${response.status}`);
      }

      const data = await response.json();
      console.log("📌 [Frontend] Retrieved Certificate Data:", data);
      
      if (Array.isArray(data) && data.length > 0) {
          return data; // ✅ คืนค่าเป็น Array
      } else {
          return [];
      }
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

      console.log("📌 DEBUG - File to be uploaded:", file.name);

      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("📌 DEBUG - IPFS Response:", response.data);
      return response.data.cid; // ✅ คืนค่า CID ของไฟล์ที่อัปโหลด
  } catch (error: any) {
      console.error("❌ [ERROR] Uploading certificate:", error.response?.data || error.message);
      return null;
  }
};


// ✅ อัปโหลดใบเซอร์และตั้งค่า state ใน component (ใช้ในหน้า `FarmGeneralInfo.tsx`)
export const uploadAndSetCertificate = async (
    file: File,
    setCertificateData: React.Dispatch<React.SetStateAction<any | null>>,
    setCertificateFile: React.Dispatch<React.SetStateAction<File | null>>,
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>
): Promise<string | null> => {
    const certCID = await uploadCertificate(file);
    if (certCID) {
        setCertificateData({ cid: certCID });
        setCertificateFile(null);
        setFileNames(["No file selected."]);
    }
    return certCID;
};

// ✅ สร้างหรืออัปเดตใบเซอร์
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

        const response = await axios.post(`${API_BASE_URL}/create`, payload);
        console.log("✅ Certification created/updated:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [ERROR] Creating/updating certificate:", error.response?.data || error.message);
        return null;
    }
};

// ✅ ลบใบเซอร์ (Soft Delete)
export const deleteCertificate = async (entityID: string) => {
    try {
        if (!entityID) throw new Error("Entity ID is required for deleting certificate");

        const response = await axios.delete(`${API_BASE_URL}/${entityID}`);
        console.log("✅ Certification deleted:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("❌ [ERROR] Deleting certificate:", error.response?.data || error.message);
        return null;
    }
};

// ✅ จัดการลบใบเซอร์และอัปเดต state
export const handleDeleteCertificate = async (
    entityID: string,
    setCertificateData: React.Dispatch<React.SetStateAction<any | null>>
) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบใบเซอร์นี้?");
    if (!confirmDelete) return;

    const result = await deleteCertificate(entityID);
    if (result) {
        setCertificateData(null);
        alert("✅ ใบเซอร์ถูกลบเรียบร้อยแล้ว");
    } else {
        alert("❌ ลบใบเซอร์ไม่สำเร็จ");
    }
};
