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
