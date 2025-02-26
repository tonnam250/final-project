const API_URL = "http://127.0.0.1:8080/api/v1/auth"; // ✅ แก้ให้ตรงกับ Backend

// ✅ ฟังก์ชัน Login (คืนค่า role และ URL ที่ต้อง Redirect)
export const login = async (email: string, password: string) => {
    console.log("📡 [Login] Sending Request to API...");
    
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ สำคัญมาก! ต้องใช้เพื่อให้ Browser รับ-ส่ง Cookies
    });

    const data = await response.json();
    console.log("📡 [Login] API Response:", response.status, data);

    if (!response.ok) {
        console.error("❌ [Login Error]:", data.error);
        throw new Error(data.error || "Login failed");
    }

    console.log("✅ [Login] Success! Redirecting to:", data.role);

    // ✅ เช็คว่า Cookies ถูกเก็บหรือไม่
    const cookies = document.cookie;
    console.log("🍪 [Cookies after login]:", cookies);

    // ✅ ถ้า `auth_token` ไม่อยู่ใน Cookies ให้แจ้งเตือน
    if (!cookies.includes("auth_token")) {
        console.error("❌ [Error]: `auth_token` is missing in cookies.");
        throw new Error("Login successful, but token is missing. Please check backend.");
    }

    return {
        role: data.role,
        redirectUrl: getRedirectUrl(data.role),
    };
};


// ✅ ฟังก์ชัน Logout
export const logout = async () => {
    console.log("📡 [Logout] Sending Request to API...");

    await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    console.log("✅ [Logout] Success!");
};

// ✅ ฟังก์ชันดึง Role ของผู้ใช้จาก Cookie
export const getUserRole = async (): Promise<string | null> => {
    console.log("📡 [GetUserRole] Fetching Role...");

    const response = await fetch(`${API_URL}/get-role`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) return null;
    const data = await response.json();
    console.log("✅ [GetUserRole] User Role:", data.role);

    return data.role;
};

// ✅ ฟังก์ชันเลือก URL ตาม Role
export const getRedirectUrl = (userRole: string) => {
    console.log("🔄 [Redirect] User Role:", userRole);

    switch (userRole) {
        case "farmer":
            return "/Farmer/Profile";
        case "factory":
            return "/FactoryDashboard";
        case "logistics":
            return "/LogisticsDashboard";
        case "retailer":
            return "/RetailerDashboard";
        default:
            return "/dashboard"; // ✅ Default
    }
};

export const getUserInfo = async (): Promise<{ email: string; password: string } | null> => {
    console.log("📡 [GetUserInfo] Fetching user info...");

    const response = await fetch(`${API_URL}/user-info`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        console.error("❌ [GetUserInfo] Failed to fetch user info:", response.status);
        return null;
    }

    const data = await response.json();
    console.log("✅ [GetUserInfo] User info:", data);
    return data;
};

// ✅ ฟังก์ชันอัปเดตข้อมูลผู้ใช้ (email, password) ไปยัง Backend
export const updateUserInfo = async (email: string, password: string): Promise<boolean> => {
    console.log("📡 [UpdateUserInfo] Updating user info...");

    const response = await fetch(`${API_URL}/update-user`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        console.error("❌ [UpdateUserInfo] Failed to update user info:", response.status);
        return false;
    }

    console.log("✅ [UpdateUserInfo] User info updated successfully");
    return true;
};

// ✅ ตรวจสอบว่าอีเมลซ้ำหรือไม่
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/check-email?email=${email}`);
        const data = await response.json();
        return data.available;
    } catch (err) {
        console.error("❌ [Check Email] Error:", err);
        return false;
    }
};

// ✅ ฟังก์ชันสมัครสมาชิก
export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");

        return data;
    } catch (err) {
        console.error("❌ [SignUp] Error:", err);
        throw new Error(err instanceof Error ? err.message : "Registration failed");
    }
};