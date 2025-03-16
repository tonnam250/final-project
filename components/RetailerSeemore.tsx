import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface RetailerSeemoreProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RetailerSeemore({ isOpen, onClose }: RetailerSeemoreProps) {
    const [data, setData] = useState<any[]>([]); // เปลี่ยนจาก null → []

    useEffect(() => {
        const storedData = localStorage.getItem("trackingData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setData(parsedData?.retailer || []); // ดึง array มาเต็ม ๆ
        }
      }, []);
      
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-11/12 max-w-6xl h-auto max-h-[90vh] overflow-y-auto relative transition-transform scale-100 hover:scale-[1.02] duration-300">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-3 rounded-full hover:bg-gray-300 transition"
                >
                    <X className="w-6 h-6 text-gray-600" />
                </button>

                {/* Header */}
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Retailer Details
                </h1>

                {data.length > 0 ? (
  data.map((retailer, index) => (
    <div key={index} className="flex flex-col gap-6 w-full text-gray-800">

      {/* General Info */}
      <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            🏪 Retailer Information ({index + 1})
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 text-lg text-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">🏷️</span>
            <p className="font-semibold">Retailer Name:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.generalInfo?.retailerName || "-"}</p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">📍</span>
            <p className="font-semibold">Address:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.generalInfo?.address || "-"}</p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">📞</span>
            <p className="font-semibold">Contact:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.generalInfo?.contact || "-"}</p>
        </div>
      </div>

      {/* Received Product */}
      <div className="p-6 bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            📦 Received Product
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 text-lg text-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">🔍</span>
            <p className="font-semibold">Tracking ID:</p>
          </div>
          <p className="text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-lg w-fit">
            {retailer.receivedProduct?.trackingId || "-"}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">👤</span>
            <p className="font-semibold">Person in Charge:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.receivedProduct?.recipientInfo?.personInCharge || "-"}</p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">📍</span>
            <p className="font-semibold">Location:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.receivedProduct?.recipientInfo?.location || "-"}</p>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xl">⏰</span>
            <p className="font-semibold">Pick Up Time:</p>
          </div>
          <p className="text-gray-700 font-medium">{retailer.receivedProduct?.recipientInfo?.pickUpTime || "-"}</p>
        </div>
      </div>

      {/* Quality Section */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-white backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-between border-b-2 border-gray-300 pb-3 mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            🏆 Product Quality
          </h2>
        </div>
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-lg text-lg">
          <tbody>
            <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">🌡️ pH Level</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.pH || "-"}</td>
            </tr>
            <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">🥛 Fat Content</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.fat || "-"}%</td>
            </tr>
            <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">💪 Protein Content</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.protein || "-"}%</td>
            </tr>
            <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">🌡️ Temperature</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.temperature || "-"} {retailer.receivedProduct?.quantity?.tempUnit}</td>
            </tr>
            <tr className="border-b border-gray-300 hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">🦠 Bacteria Info</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.bacteriaInfo || "-"}</td>
            </tr>
            <tr className="hover:bg-gray-100 transition">
              <td className="p-4 font-semibold flex items-center gap-2">⚠️ Contaminant Info</td>
              <td className="p-4 text-gray-700 text-center">{retailer.receivedProduct?.quantity?.contaminantInfo || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Abnormal Characteristics */}
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl shadow-xl border border-gray-400 mt-6">
        <div className="flex items-center justify-between border-b-2 border-gray-400 pb-4 mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
            🚨 Abnormal Characteristics
          </h2>
          <span className="text-gray-600 text-lg italic">
            * 🔴 = พบปัญหา | 🟢 = ปกติ
          </span>
        </div>
        <table className="w-full border-collapse text-xl font-medium">
          <thead>
            <tr className="bg-gray-300 text-gray-900 border-b border-gray-500 text-lg uppercase">
              <th className="p-4 text-left tracking-wide">ลักษณะผิดปกติ</th>
              <th className="p-4 text-center tracking-wide">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(retailer.receivedProduct?.quantity?.abnormalType || {}).map(([key, value]) => {
              return (
                <tr key={key} className="border-b border-gray-400">
                  <td className="p-4 font-semibold text-gray-900">{key}</td>
                  <td
                    className={`p-4 text-center font-bold text-lg tracking-wide ${
                      value ? "text-red-700" : "text-green-700"
                    }`}
                  >
                    {value ? "❌ พบปัญหา" : "✅ ปกติ"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  ))
) : (
  <p className="text-center text-gray-500 text-lg">No data available</p>
)}


            </div>
        </div>
    );
}
