// 📌 fileService.ts

// ✅ แปลงไฟล์เป็น Base64
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            console.log("📌 Base64 Encoding Success:", reader.result);
            resolve(reader.result as string);
        };

        reader.onerror = (error) => {
            console.error("❌ [ERROR] Reading file as Base64 failed:", error);
            reject(error);
        };

        reader.readAsDataURL(file);
    });
};

// ✅ จัดการไฟล์ที่อัปโหลด และตั้งค่า state (ใช้ในหน้า `FarmGeneralInfo.tsx`)
export const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>,
    setCertificateFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
    if (!event.target.files || event.target.files.length === 0) {
        console.warn("⚠️ No file selected.");
        return;
    }

    const file = event.target.files[0];
    console.log("📌 Selected File:", file);

    setFileNames([file.name]);
    setCertificateFile(file);

    try {
        const base64 = await convertFileToBase64(file);
        console.log("📌 Base64 File (Stored in LocalStorage):", base64);

        localStorage.setItem("certBase64", base64.split(",")[1]);
    } catch (error) {
        console.error("❌ [ERROR] Converting file to Base64:", error);
        setCertificateFile(null);
    }
};