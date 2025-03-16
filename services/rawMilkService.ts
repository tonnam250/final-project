const API_URL = "http://127.0.0.1:8080/api/v1/farm/milk/";

export const createMilkTank = async (data: any): Promise<{ 
    success: boolean; 
    message?: string; 
    txHash?: string; 
    qrCodeCID?: string; 
    tankId?: string;  // ✅ เพิ่ม tankId ที่ต้องใช้ในการ Redirect
}> => {
    try {
        const response = await fetch(API_URL + "create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!response.ok) {
            const errorResult = await response.json().catch(() => ({ error: "Unknown error occurred" }));
            return { success: false, message: errorResult.error };
        }

        const result = await response.json();

        return {
            success: true,
            message: "Milk Tank Created Successfully!",
            txHash: result.txHash,
            qrCodeCID: result.qrCodeCID,
            tankId: result.tankId, // ✅ ส่ง tankId กลับไปให้ Frontend ใช้
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error: Unable to reach the server",
        };
    }
};


export const getFarmRawMilkTanks = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL + "list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ ส่ง Cookie ไปกับ Request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch milk tanks");
        }

        const data = await response.json();

        // ✅ ตรวจสอบว่ามี `displayedMilkTanks` หรือไม่
        if (!data || !data.displayedMilkTanks || !Array.isArray(data.displayedMilkTanks)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        // ✅ แปลงข้อมูลให้ตรงกับ `FarmRawMilk.tsx`
        const formattedData = data.displayedMilkTanks.map((tank: any) => ({
            milkTankInfo: {
                tankId: tank.moreInfoLink.split("=")[1].trim(), // ✅ ใช้ trim() เพื่อลบ `\u0000`
                personInCharge: tank.personInCharge,
            },
            status: tank.status === 0 ? "Pending" : tank.status === 1 ? "Received" : "Rejected", // ✅ เพิ่มเงื่อนไขสำหรับ `Rejected`
            id: tank.moreInfoLink.split("=")[1].trim(), // ✅ ใช้ trim() เพื่อลบ `\u0000`
        }));

        console.log("✅ Formatted Milk Tanks:", formattedData);
        return formattedData;
    } catch (error) {
        console.error("❌ Error fetching farm raw milk tanks:", error);
        return [];
    }
};


// ✅ ฟังก์ชันดึงรายละเอียดแท็งก์นมดิบตาม Tank ID
export const getMilkTankDetails = async (tankId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}details/${tankId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ ส่ง Cookie ไปกับ Request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch milk tank details");
        }

        const data = await response.json();
        console.log("✅ Fetched Milk Tank Details:", data); // Debugging

        return data;
    } catch (error) {
        console.error("❌ Error fetching milk tank details:", error);
        return null;
    }
};

// ✅ ฟังก์ชันดึง QR Code ตาม Tank ID
export const getQRCodeByTankID = async (tankId: string): Promise<string | null> => {
    try {
        const response = await fetch(`${API_URL}qrcode/${tankId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ ส่ง Cookie ไปกับ Request
        });

        if (!response.ok) {
            throw new Error("Failed to fetch QR Code");
        }

        const data = await response.json();

        // ✅ ตรวจสอบว่ามี `qrCodeImg`
        if (!data || !data.qrCodeImg) {
            console.error("❌ Invalid API response format:", data);
            return null;
        }

        console.log("✅ QR Code Image URL:", data.qrCodeImg);
        return data.qrCodeImg;
    } catch (error) {
        console.error("❌ Error fetching QR Code:", error);
        return null;
    }
};





