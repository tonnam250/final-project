const API_URL = "http://127.0.0.1:8080/api/v1/farm/milk/";

export const createMilkTank = async (data: any): Promise<{ success: boolean; message?: string; txHash?: string; qrCodeCID?: string }> => {
    try {
        const response = await fetch(API_URL + "create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", // ✅ ส่ง Cookie ไปกับ Request
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
            qrCodeCID: result.qrCodeCID
        };
    } catch (error) {
        return {
            success: false,
            message: "Network error: Unable to reach the server",
        };
    }
};


