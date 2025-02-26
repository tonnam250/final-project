// 📌 fileService.ts

// ✅ แปลงไฟล์เป็น Base64
export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

// ✅ จัดการไฟล์ที่อัปโหลด และตั้งค่า state (ใช้ในหน้า `FarmGeneralInfo.tsx`)
export const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFileNames: React.Dispatch<React.SetStateAction<string[]>>,
    setCertificateFile: React.Dispatch<React.SetStateAction<File | null>>
) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setFileNames([file.name]);
        setCertificateFile(file);

        try {
            const base64 = await convertFileToBase64(file);
            localStorage.setItem("certBase64", base64.split(",")[1]); // ✅ เก็บ Base64 ใน localStorage
        } catch (error) {
            console.error("❌ [ERROR] Converting file to Base64:", error);
            setCertificateFile(null);
        }
    } else {
        setFileNames(["ยังไม่ได้เลือกไฟล์"]);
        setCertificateFile(null);
    }
};
