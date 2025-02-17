const API_URL = "http://127.0.0.1:8080/api/v1/farmers/me";

// ✅ ฟังก์ชันดึงข้อมูลฟาร์ม
export const getFarmInfo = async (): Promise<any | null> => {
    const response = await fetch("http://127.0.0.1:8080/api/v1/farmers/me", {
        method: "GET",
        credentials: "include", // ✅ ต้องใช้ Cookie
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("❌ [ERROR] Fetching farm data failed:", response.status);
        return null;
    }

    return await response.json();
};


// ✅ ฟังก์ชันอัปเดตข้อมูลฟาร์ม
export const updateFarmInfo = async (farmData: any): Promise<boolean> => {
    console.log("📡 [UpdateFarmInfo] Updating farm data...");

    const response = await fetch(`${API_URL}/farmers/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(farmData),
    });

    if (!response.ok) {
        console.error("❌ [UpdateFarmInfo] Failed to update farm data");
        return false;
    }

    console.log("✅ [UpdateFarmInfo] Farm data updated successfully");
    return true;
};
