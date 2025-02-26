const API_URL = "http://127.0.0.1:8080/api/v1/farmers";

import { uploadCertificate, createOrUpdateCertificate } from "./certificateService";

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

        if (!response.ok) {
            throw new Error(`Fetching farm data failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ [ERROR] Fetching farm data failed:", error);
        return null;
    }
};

// ✅ อัปเดตข้อมูลฟาร์ม
export const updateFarmInfo = async (farmData: any): Promise<any | null> => {
    try {
        console.log("📡 [UpdateFarmInfo] Updating farm data...");
        console.log("📌 DEBUG - Payload being sent to Backend:", farmData);
        const response = await fetch(`${API_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(farmData),
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

// ✅ ฟังก์ชันอัปเดตข้อมูลฟาร์มรวมกับอัปโหลดใบเซอร์
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
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>
) => {
    let certCID = certificateData?.cid || "";

    // ✅ อัปโหลดไฟล์ใบเซอร์ถ้ามีการเลือกไฟล์ใหม่
    if (certificateFile) {
        try {
            console.log("📌 Uploading certificate file:", certificateFile.name);
            const uploadResult = await uploadCertificate(certificateFile);

            if (uploadResult) {  // ✅ แก้ไขตรงนี้ เพราะ uploadCertificate() คืนค่าเป็น string (CID)
                certCID = uploadResult;
                console.log("📌 Received CID from IPFS:", certCID); // ✅ Debug CID ที่ได้จาก IPFS
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

    // ✅ สร้าง payload สำหรับอัปเดตฟาร์ม
    const payload = {
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
        cert_file: certCID, // ✅ ใช้ certCID ที่อัปโหลดแล้ว
    };

    try {
        const result = await updateFarmInfo(payload);
        if (result) {
            console.log("✅ Farm information updated successfully");

            // ✅ อัปเดตข้อมูลใบเซอร์บน Blockchain
            if (certCID) {
                const certPayload = {
                    entityType: "Farmer",
                    entityID: farmData?.farmerID,
                    certificationCID: certCID,
                    issuedDate: new Date().toISOString(),
                    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                };

                console.log("📌 Sending certification data to Blockchain:", certPayload); // ✅ Debug
                try {
                    const certUpdate = await createOrUpdateCertificate(certPayload);
                    console.log("📌 API Response:", certUpdate); // ✅ Debug Response

                    if (certUpdate) {
                        console.log("✅ Certification updated on Blockchain");
                        setCertificateData(certUpdate);
                    } else {
                        console.warn("⚠️ Failed to update certification on Blockchain");
                    }
                } catch (error) {
                    console.error("❌ ERROR calling createOrUpdateCertificate:", error);
                }
            }

            alert("✅ อัปเดตข้อมูลฟาร์มสำเร็จ!");
            setFarmData(result);
        } else {
            alert("❌ อัปเดตข้อมูลฟาร์มไม่สำเร็จ");
        }
    } catch (error) {
        console.error("❌ Error updating farm information:", error);
        alert("เกิดข้อผิดพลาดขณะอัปเดตข้อมูลฟาร์ม");
    }
};

