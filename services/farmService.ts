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
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>
) => {
    let certCID = certificateData?.cid || "";

    // ✅ ถ้ามีไฟล์ใบเซอร์ใหม่ → อัปโหลดไปยัง IPFS
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

    // ✅ ตรวจสอบว่า CID นี้มีอยู่บน Blockchain หรือไม่
    if (certCID) {
        console.log("📌 Checking if certification CID exists on Blockchain...");
        const isDuplicate = await checkUserCertification(certCID);
        if (isDuplicate) {
            alert("⚠️ CID ของใบเซอร์นี้มีอยู่แล้วในระบบ Blockchain!");
            return;
        }
    }

    // ✅ สร้าง payload สำหรับอัปเดตข้อมูลฟาร์ม
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
        cert_file: certCID, // ✅ เพิ่ม certCID เข้าไปใน payload
    };

    try {
        // ✅ อัปเดตข้อมูลฟาร์ม
        const result = await updateFarmInfo(payload);
        if (result) {
            console.log("✅ Farm information updated successfully");

            // ✅ อัปเดตใบเซอร์ลง Blockchain ถ้ามี certCID
            if (certCID) {
                const certPayload = {
                    entityType: "Farmer",
                    entityID: farmData?.farmerID,
                    certificationCID: certCID,
                    issuedDate: new Date().toISOString(),
                    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                };

                console.log("📌 Sending certification data to Blockchain:", certPayload);
                try {
                    const certUpdate = await createOrUpdateCertificate(certPayload);
                    console.log("📌 API Response:", certUpdate);

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
            firstname: farmData?.firstName,
            lastname: farmData?.lastName,
            email: farmData?.email,
            address: farmData?.address,
            district: farmData?.district,
            subdistrict: farmData?.subdistrict,
            province: farmData?.province,
            phone: farmData?.telephone,
            areaCode: farmData?.areaCode,
            location_link: farmData?.location,
            cert_file: certCID, // ✅ เพิ่ม CID ของใบเซอร์ลงใน payload
        };

        console.log("📌 Sending farm creation data to Backend:", payload);

        // ✅ ส่งข้อมูลไปยัง API `/create-farm`
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
