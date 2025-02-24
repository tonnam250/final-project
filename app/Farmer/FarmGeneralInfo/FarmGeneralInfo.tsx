"use client";

import { useState, useEffect } from "react";
import { MapProvider } from "@/providers/map-provider";
import { MapComponent } from "@/components/map";

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

const FarmGeneralInfo = () => {
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);
    const [isEditable, setIsEditable] = useState<boolean>(true);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files).map((file) => file.name);
            setFileNames(files.length ? files : ["ยังไม่ได้เลือกไฟล์"]);
        } else {
            setFileNames(["ยังไม่ได้เลือกไฟล์"]);
        }
    };

    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");

    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
        lat: 35.8799866,
        lng: 76.5048004,
    });

    useEffect(() => {
        fetch("/data/geography.json")
            .then((res) => res.json())
            .then((data: GeoData[]) => {
                setGeoData(data);

                // ดึงจังหวัดที่ไม่ซ้ำ (ใช้ภาษาไทยให้ตรงกับ selectedProvince)
                const provinces = Array.from(new Set(data.map((item) => item.provinceNameEn)));
                setProvinceList(provinces);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.provinceNameEn === selectedProvince).map((item) => item.districtNameEn)
                )
            );

            setDistrictList(filteredDistricts);
            setSelectedDistrict("");
            setSubDistrictList([]);
            setSelectedSubDistrict("");
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const filteredSubDistricts = Array.from(
                new Set(
                    geoData.filter((item) => item.districtNameEn === selectedDistrict).map((item) => item.subdistrictNameEn)
                )
            );

            setSubDistrictList(filteredSubDistricts);
            setSelectedSubDistrict("");
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedProvince) {
            localStorage.setItem("selectedProvince", selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            localStorage.setItem("selectedDistrict", selectedDistrict);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        if (selectedSubDistrict) {
            localStorage.setItem("selectedSubDistrict", selectedSubDistrict);
        }
    }, [selectedSubDistrict]);

    const handleSaveEditToggle = () => {
        setIsEditable(!isEditable);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsEditable(false);

        const formData = new FormData(event.currentTarget);
        formData.append("province", selectedProvince);
        formData.append("district", selectedDistrict);
        formData.append("subDistrict", selectedSubDistrict);

        // Handle form submission logic here
        // For example, you can send formData to an API endpoint
        // fetch('/api/submit', {
        //     method: 'POST',
        //     body: formData,
        // }).then(response => {
        //     // Handle response
        // }).catch(error => {
        //     // Handle error
        // });
    };

    // const fetchCoordinates = async (address: string) => {
    //     const response = await fetch(
    //         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
    //     );
    //     const data = await response.json();
    //     if (data.results && data.results.length > 0) {
    //         const location = data.results[0].geometry.location;
    //         setMapCenter({ lat: location.lat, lng: location.lng });
    //     } else {
    //         console.error("Geocoding API error:", data);
    //     }
    // };

    // const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const address = event.target.value;
    //     fetchCoordinates(address);
    // };

    return (
        <div className="flex flex-col text-center w-full justify-center items-center text- h-full pt-20">
            <h1 className="text-3xl md:text-4xl font-bold my-4 md:my-8">General Information</h1>
            <div className="flex h-full w-11/12 md:w-8/12 h-11/12 p-4 md:p-5 shadow-xl justify-center items-center border rounded-2xl m-2 md:m-5">
                <form action="" className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 text-start w-full">

                        {/* first name */}
                        <div className="flex flex-col text-start w-full md:w-6/12">
                            <label htmlFor="fName" className="font-medium">First Name</label>
                            <input
                                type="text"
                                id="fName"
                                name="fName"
                                className="border border-gray-300 rounded-md p-2 w-full"
                                required
                                disabled={!isEditable}
                            />
                        </div>
                        {/* end first name */}

                        {/* lastName */}
                        <div className="flex flex-col text-start w-full md:w-6/12">
                            <label htmlFor="lName" className="font-medium">Last Name</label>
                            <input
                                type="text"
                                id="lName"
                                name="lName"
                                className="border border-gray-300 rounded-md p-2 w-full"
                                required
                                disabled={!isEditable}
                            />
                        </div>
                        {/* end lastName */}
                    </div>

                    {/* email */}
                    <div className="flex flex-col text-start w-full">
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="border border-gray-300 rounded-md p-2"
                            placeholder="Example@gmail.com"
                            required
                            disabled={!isEditable}
                        />
                    </div>
                    {/* end email */}

                    {/* Phone Number */}
                    <div className="flex flex-col text-start">
                        <label htmlFor="tel" className="font-medium">Phone Number</label>
                        <div className="flex flex-col md:flex-row gap-2">

                            {/* Area Code */}
                            <div className="flex flex-col">
                                <label htmlFor="areaCode" className="sr-only">Area Code</label>
                                <select
                                    name="areaCode"
                                    id="areaCode"
                                    className="border border-gray-300 rounded-md p-2 w-full md:w-20 text-center"
                                    required
                                    disabled={!isEditable}
                                >
                                    <option value="+66">+66</option>
                                    <option value="+1">+1</option>
                                    <option value="+44">+44</option>
                                </select>
                            </div>

                            {/* Phone Input */}
                            <input
                                type="tel"
                                id="tel"
                                name="tel"
                                className="border border-gray-300 rounded-md p-2 flex-1 w-full"
                                placeholder="Enter your phone number"
                                required
                                disabled={!isEditable}
                            />
                        </div>
                    </div>
                    {/* end Phone number */}

                    {/* Address */}
                    <div className="flex flex-col text-start font-medium">
                        <label htmlFor="address">Address</label>
                        <textarea name="address" id="address" className="border border-gray-300 rounded-md p-2 flex-1 w-full" disabled={!isEditable}></textarea>
                    </div>
                    {/* end Address */}

                    {/* province */}
                    <div className="flex flex-col w-full text-start font-medium">
                        <label htmlFor="province">Province</label>
                        <select name="province" id="province" className="border border-gray-300 rounded-md p-2 text-center"
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            disabled={!isEditable}>
                            <option value="">Select province</option>
                            {provinceList.map((prov, index) => (
                                <option key={index} value={prov}>
                                    {prov}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* end province */}

                    {/* district + Sub-District */}
                    <div className="flex flex-col md:flex-row w-full gap-4">
                        <div className="flex flex-col text-start font-medium w-full md:w-6/12">
                            <label htmlFor="district">District</label>
                            <select name="district" id="district" className="border border-gray-300 rounded-md p-2 text-center"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedProvince || !isEditable}>
                                <option value="">Select district</option>
                                {districtList.map((dist, index) => (
                                    <option key={index} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col text-start font-medium w-full md:w-6/12">
                            <label htmlFor="subDistrict">Sub-District</label>
                            <select name="subDistrict" id="subDistrict" className="border border-gray-300 rounded-md p-2 text-center"
                                value={selectedSubDistrict}
                                onChange={(e) => setSelectedSubDistrict(e.target.value)}
                                disabled={!selectedDistrict || !isEditable}>
                                <option value="">Select sub-district</option>
                                {subDistrictList.map((subDist, index) => (
                                    <option key={index} value={subDist}>
                                        {subDist}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* end district + sub-district */}

                    {/* Upload Organic certification */}
                    <label htmlFor="" className="text-start font-semibold">Uplaod Organic Certification</label>
                    <div className="flex flex-col md:flex-row items-center justify-start gap-2 border p-2">
                        <label
                            htmlFor="file-upload"
                            className={`cursor-pointer px-4 py-2 bg-[#abc32f] text-white rounded-lg hover:bg-[#607c3c] transition ${!isEditable && "opacity-50 cursor-not-allowed"}`}
                        >
                            Import file
                        </label>
                        <span className="text-sm text-gray-600">
                            {fileNames.length > 1 ? `${fileNames.length} files selected` : fileNames[0]}
                        </span>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                            disabled={!isEditable}
                        />
                    </div>
                    {/* end upload organic certification */}

                    {/* location */}
                    <div className="flex flex-col font-medium text-start">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            className="border border-gray-300 rounded-md p-2 flex-1 w-full"
                            placeholder="Enter a location"
                            disabled={!isEditable}
                        />

                        {/* <MapProvider>
                            <MapComponent center={mapCenter} />
                        </MapProvider> */}
                    </div>

                    <button
                        type="button"
                        className="flex items-center justify-center text- md:text-xl bg-[#abc32f] hover: w-full md:w-1/6 rounded-full p-2 px-3 text-white self-center"
                        onClick={isEditable ? handleSubmit : handleSaveEditToggle}
                    >
                        {isEditable ? "Save" : "Edit"}
                        {isEditable ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ml-2 w-6 h-6">
                                <path fill="currentColor" d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1-3 3a3 3 0 0 1-3-3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-6 h-6" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z" />
                            </svg>
                        )}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default FarmGeneralInfo;