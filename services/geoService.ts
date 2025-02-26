// 📌 geoService.ts

interface GeoData {
    id: number;
    provinceCode: number;
    provinceNameEn: string;
    provinceNameTh: string;
    districtCode: number;
    districtNameEn: string;
    districtNameTh: string;
    subdistrictCode: number;
    subdistrictNameEn: string;
    subdistrictNameTh: string;
    postalCode: number;
}

// ✅ โหลดข้อมูลที่อยู่จังหวัด อำเภอ ตำบล จากไฟล์ JSON (ใช้ Cache)
let cachedGeoData: GeoData[] | null = null;

export const getGeoData = async (): Promise<GeoData[]> => {
    if (cachedGeoData) return cachedGeoData; // ✅ ใช้ Cache ถ้ามี

    try {
        const response = await fetch("/data/geography.json");
        const data: GeoData[] = await response.json();
        cachedGeoData = data; // ✅ บันทึก Cache
        return data;
    } catch (error) {
        console.error("❌ [ERROR] Fetching geography data failed:", error);
        return [];
    }
};

// ✅ ดึงรายการจังหวัด
export const getProvinceList = (geoData: GeoData[]): string[] => {
    return [...new Set(geoData.map((item) => item.provinceNameEn))];
};

// ✅ ดึงรายการอำเภอตามจังหวัดที่เลือก
export const getDistrictList = (geoData: GeoData[], selectedProvince: string): string[] => {
    return [...new Set(
        geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
    )];
};

// ✅ ดึงรายการตำบลตามอำเภอที่เลือก
export const getSubDistrictList = (geoData: GeoData[], selectedDistrict: string): string[] => {
    return [...new Set(
        geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
    )];
};
