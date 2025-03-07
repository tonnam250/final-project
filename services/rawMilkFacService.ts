const API_URL = "http://127.0.0.1:8080/api/v1/factory/milk/";

export const getFactoryRawMilkTanks = async (): Promise<any> => {
    try {
        const response = await fetch(API_URL + "list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ ส่ง Cookie (เฉพาะ Client Component เท่านั้น)
            cache: "no-store", // ✅ ป้องกัน Next.js แคชข้อมูลใน Server Component
        });

        if (!response.ok) {
            console.error("❌ Failed to fetch factory milk tanks, Status:", response.status);
            throw new Error("Failed to fetch factory milk tanks");
        }

        const data = await response.json();
        console.log("📡 API Response:", data);

        // ✅ ตรวจสอบโครงสร้าง API Response
        if (!data || typeof data !== "object" || !Array.isArray(data.displayedMilkTanks)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        // ✅ แปลงข้อมูลให้ตรงกับ `RecieveRM.tsx`
        const formattedData = data.displayedMilkTanks.map((tank: any) => ({
            milkTankInfo: {
                tankId: tank?.moreInfoLink?.split("=")[1]?.trim() || "", // ✅ ป้องกัน `split` แล้ว Error
                personInCharge: tank?.personInCharge || "Unknown",
            },
            status: tank?.status === 0 ? "Pending" : "Received",
            id: tank?.moreInfoLink?.split("=")[1]?.trim() || "", // ✅ ป้องกัน `split` แล้ว Error
        }));

        console.log("✅ Formatted Factory Milk Tanks:", formattedData);
        return formattedData;
    } catch (error) {
        console.error("❌ Error fetching factory raw milk tanks:", error);
        return [];
    }
};
