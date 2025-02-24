"use client";

import { useState, useEffect } from "react";

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

const FactoryGeneral = () => {

    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);
    
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
    
        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // Handle form submission logic here
        };

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
                            />
                        </div>
                    </div>
                    {/* end Phone number */}

                    {/* Address */}
                    <div className="flex flex-col text-start font-medium">
                        <label htmlFor="address">Address</label>
                        <textarea name="address" id="address" className="border border-gray-300 rounded-md p-2 flex-1 w-full"></textarea>
                    </div>
                    {/* end Address */}

                    {/* province */}
                    <div className="flex flex-col w-full text-start font-medium">
                        <label htmlFor="province">Province</label>
                        <select name="province" id="province" className="border border-gray-300 rounded-md p-2 text-center"
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}>
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
                                disabled={!selectedProvince}>
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
                                disabled={!selectedDistrict}>
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
                    <div className="flex flex-col md:flex-row items-center justify-start gap-2 border p-2">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-4 py-2 bg-[#C98986] text-[#F7FCD4] rounded-lg hover:bg-[#6C0E23] transition"
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
                        />
                    </div>
                    {/* end upload organic certification */}

                    {/* location */}
                    <div className="flex flex-col font-medium text-start">
                        <label htmlFor="location">Location</label>
                        <input type="text" name="location" id="location" className="border border-gray-300 rounded-md p-2 flex-1 w-full" />
                    </div>

                    <button className="text- md:text-xl bg-[#C98986] w-full md:w-1/6 rounded-full  p-2 px-3 text-[#F7FCD4] hover:bg-[#6C0E23] self-center">Save</button>
                </form>
            </div>
        </div>
    );
};

export default FactoryGeneral;