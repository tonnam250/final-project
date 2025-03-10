const API_URL = "http://127.0.0.1:8080/api/v1/products/";

export const createProduct = async (data: any): Promise<{ 
    success: boolean; 
    message?: string; 
    txHash?: string; 
    productId?: string;  // ✅ ใช้ productId เพื่อให้ Frontend สามารถ Redirect หรือแสดงข้อมูลได้
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
            message: "Product Created Successfully!",
            txHash: result.txHash,
            productId: result.productId, // ✅ ส่ง productId กลับไปให้ Frontend ใช้
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error: Unable to reach the server",
        };
    }
};

export const fetchFactoryProducts = async (searchQuery = ""): Promise<any> => {
    try {
        let url = `${API_URL}list`;
        if (searchQuery) {
            url += `?search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // ✅ ส่งคุกกี้ไปด้วย
            cache: "no-store", // ✅ ป้องกัน Next.js แคชข้อมูล
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch factory products, Status: ${response.status}`);
            throw new Error("Failed to fetch factory products");
        }

        const data = await response.json();
        console.log("📡 API Response:", JSON.stringify(data, null, 2)); // ✅ แสดงข้อมูลที่ API ส่งมา

        // ✅ ตรวจสอบว่า API ตอบกลับเป็นอาร์เรย์หรือไม่
        if (!Array.isArray(data)) {
            console.error("❌ Invalid API response format:", data);
            return [];
        }

        return data;
    } catch (error) {
        console.error("❌ Error fetching factory products:", error);
        return [];
    }
};
