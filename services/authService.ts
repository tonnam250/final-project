const API_URL = "http://127.0.0.1:8080/api/v1/auth"; // ✅ แก้ให้ตรงกับ Backend

// ✅ ฟังก์ชัน Login (คืนค่า role และ URL ที่ต้อง Redirect)
export const login = async (email: string, password: string) => {
    console.log("📡 [Login] Sending Request to API...");
    
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });

    const data = await response.json();
    console.log("📡 [Login] API Response:", response.status, data);

    if (!response.ok) {
        console.error("❌ [Login Error]:", data.error);
        throw new Error(data.error || "Login failed");
    }

    console.log("✅ [Login] Success! Redirecting to:", data.role);

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

// ✅ ฟังก์ชันดึง Role ของผู้ใช้จาก Backend
export const getUserRole = async (): Promise<string | null> => {
    console.log("📡 [GetUserRole] Fetching Role...");

    const response = await fetch(`${API_URL}/get-role`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        console.warn("⚠️ [GetUserRole] User role not found.");
        return null; // ✅ ถ้าไม่มี Role ให้คืนค่า null
    }

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
            return "/SignUp/SelectRole"; // ✅ Default
    }
};

// ✅ อัปเดต Role ของผู้ใช้ (หลังสมัครหรือเปลี่ยน Role)
export const updateUserRole = async (email: string, role: string, entityID: string) => {
    try {
        console.log(`📡 [UpdateUserRole] Updating user role to ${role}...`);

        const response = await fetch(`${API_URL}/update-role`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role, entityID }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user role: ${response.status}`);
        }

        console.log("✅ [UpdateUserRole] User role updated successfully");
        return true;
    } catch (error) {
        console.error("❌ [ERROR] Updating user role failed:", error);
        return false;
    }
};

// ✅ ฟังก์ชันดึงข้อมูลผู้ใช้จาก Backend
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

// ✅ ฟังก์ชันสมัครสมาชิก (ล็อกอินอัตโนมัติหลังสมัครเสร็จ)
export const registerUser = async (username: string, email: string, password: string, router: any) => {
    try {
        console.log("📡 [Register] Registering user...");

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");

        console.log("✅ [Register] Success! Logging in automatically...");
        
        // ✅ ล็อกอินอัตโนมัติ
        await login(email, password);

        // ✅ Reload หน้าเพื่อดึงโทเค็นจากคุกกี้
        console.log("🔄 [Register] Reloading page to apply token...");
        router.refresh();

        // ✅ พาไปหน้าเลือก Role
        router.push("/SignUp/SelectRole");
    } catch (error) {
        console.error("❌ [SignUp] Error:", error);
        throw new Error(error instanceof Error ? error.message : "Registration failed");
    }
};



// ✅ ฟังก์ชันอัปเดตข้อมูลผู้ใช้ (email, password)
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
    } catch (error) {
        console.error("❌ [Check Email] Error:", error);
        return false;
    }
};

export const refreshToken = async (): Promise<string | null> => {
    console.log("📡 [RefreshToken] Requesting new token...");

    try {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: "POST",
            credentials: "include", // ส่ง Cookie ไปด้วย
        });

        if (!response.ok) {
            console.warn("⚠️ [RefreshToken] Refresh token failed.");
            return null;
        }

        const data = await response.json();
        console.log("✅ [RefreshToken] Token refreshed successfully:", data.token);

        return data.token; // คืนค่า Token ใหม่
    } catch (error) {
        console.error("❌ [RefreshToken] Error:", error);
        return null;
    }
};

// ✅ ฟังก์ชัน Fetch API พร้อม Refresh Token ถ้าหมดอายุ
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<any> => {
    console.log("📡 [fetchWithAuth] Fetching:", url);

    let response = await fetch(url, {
        ...options,
        credentials: "include", // ✅ ส่ง Cookie ไปด้วย
    });

    if (response.status === 401) { // 🔄 ถ้า Token หมดอายุ
        console.warn("⚠️ [fetchWithAuth] Token expired. Refreshing...");

        const newToken = await refreshToken();
        if (newToken) {
            console.log("🔄 [fetchWithAuth] Retrying API call with new token...");

            response = await fetch(url, {
                ...options,
                credentials: "include", // ✅ ใช้ Token ใหม่
            });
        } else {
            console.error("❌ [fetchWithAuth] Refresh token failed. Redirecting to login...");
            window.location.href = "/login"; // ✅ พาผู้ใช้ไปล็อกอินใหม่
            return null;
        }
    }

    return response.json();
};

