const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080/api/v1";

export interface ReceiverInfo {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  location: string;
}

export interface LogisticsCheckpoint {
  trackingId: string;
  logisticsProvider: string;
  pickupTime: number;
  deliveryTime: number;
  quantity: number;
  temperature: number;
  personInCharge: string;
  checkType: number; // 0 = before, 1 = during, 2 = after
  receiverCID: string;
  receiverInfo?: ReceiverInfo;
}

export interface LogisticsData {
  trackingId: string;
  beforeCheckpoints: LogisticsCheckpoint[];
  duringCheckpoints: LogisticsCheckpoint[];
  afterCheckpoints: LogisticsCheckpoint[];
}

export interface FactoryData {
    generalInfo: {
      factoryID: string;
      companyName: string;
      address: string;
      district: string;
      subDistrict: string;
      province: string;
      country: string;
      postCode: string;
      telephone: string;
      email: string;
      lineID?: string;
      facebook?: string;
      locationLink?: string;
      createdOn: string;
      walletAddress: string;
    };
    productLot: {
      productId: string;
      productName: string;
      category: string;
      description: string;
      quantity: number;
      quantityUnit: string;
    };
    selectMilkTank: {
      temp: number;
      tempUnit: string;
      pH: number;
      fat: number;
      protein: number;
      bacteria: boolean;
      bacteriaInfo: string;
      contaminants: boolean;
      contaminantInfo: string;
      abnormalChar: boolean;
      abnormalType: Record<string, any>;
    };
    quality: {
      grade: string;
      inspectionDate: string;
      inspector: string;
    };
    nutrition: Record<string, any>; // ข้อมูลโภชนาการ
  }
  

  export interface FarmData {
    farms: {
      farmID: string;
      companyName: string;
      address: string;
      subDistrict: string;
      district: string;
      province: string;
      country: string;
      postCode: string;
      telephone: string;
      email: string;
      locationLink: string;
      milkTankIDs: string[]; // ✅ อาร์เรย์ของ Milk Tank ID ที่เชื่อมโยงกับฟาร์ม
    }[];
  }
  

export interface RetailerData {
  generalInfo: {
    retailerName: string;
    address: string;
    contact: string;
  };
  receivedProduct: {
    trackingId: string;
    recipientInfo: {
      personInCharge: string;
      location: string;
      pickUpTime: string;
    };
    quantity: {
      value: number;
      unit: string;
      temperature: number;
      tempUnit: string;
      pH: number;
      fat: number;
      protein: number;
      bacteria: boolean;
      bacteriaInfo: string;
      contaminants: boolean;
      contaminantInfo: string;
      abnormalChar: boolean;
      abnormalType: Record<string, any>;
    };
  };
}

export interface TrackingResponse {
  retailer?: RetailerData[];    // เปลี่ยนจาก object → array
  logistics?: LogisticsData[];
  factory?: FactoryData;
  farm?: FarmData;
}

/**
 * Fetch tracking details from the backend
 * @param {string} trackingId - The tracking ID to fetch details for
 * @returns {Promise<TrackingResponse>} - Returns the tracking details JSON
 */
export const getTrackingDetails = async (productLotId: string): Promise<TrackingResponse> => {
  try {
    const response = await fetch(`${API_URL}/tracking-details?productLotId=${productLotId}`, {  // ✅ ต้องใช้ ( , { ) แบบนี้!
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.warn(`⚠️ API Warning: ${response.statusText}`);
      return {};
    }

    const data: TrackingResponse = await response.json();
    console.log("✅ Fetched Tracking Data:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching tracking details:", error);
    return {}; // ป้องกัน UI พัง
  }
};

