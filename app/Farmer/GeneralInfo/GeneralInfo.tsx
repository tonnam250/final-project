"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Fish } from "lucide-react";

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
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]); //oraganic certificate
    const [isEditable, setIsEditable] = useState<boolean>(true);

    const [geoData, setGeoData] = useState<GeoData[]>([]);
    const [provinceList, setProvinceList] = useState<string[]>([]);
    const [districtList, setDistrictList] = useState<string[]>([]);
    const [subDistrictList, setSubDistrictList] = useState<string[]>([]);

    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [organicCert, setOrganicCert] = useState<File[]>([]);
    const [location, setLocation] = useState("");

    const formData = new FormData();

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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setOrganicCert(Array.from(event.target.files));
        }
    }

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('address', address);
        
        organicCert.forEach((file) => {
            formData.append('organicCert', file);
        });

        formData.append('location', location);

        try {

            const res = await axios.post('/user/update-general-information', formData, {
                headers: { Authorization: `Bearer ${token}` },
                baseURL: process.env.NEXT_PUBLIC_API_URL
            })

            if (res.status === 200) {
                console.log('Res: ', res);
                alert("General Information saved!")
            }
            else {
                console.log('Unexpected response status: ', res.status)
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleButtonClick = () => {
        if (isEditable) {
            document.getElementById("farmGeneralInfoForm")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        } else {
            handleSaveEditToggle();
        }
    };

    return (
        <div className="flex flex-col text-center w-full justify-center items-center text- h-full pt-20">
            <h1 className="text-5xl md:text-4xl font-bold my-4 md:my-8">General Information</h1>
            <div className="flex h-full w-11/12 md:w-8/12 h-11/12 p-4 md:p-5 shadow-xl justify-center items-center border rounded-2xl m-2 md:m-5">
                <form id="farmGeneralInfoForm" action="" className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 text-start w-full">

                        {/* first name */}
                        <div className="flex flex-col text-start w-full md:w-6/12">
                            <label htmlFor="fName" className="font-medium">First Name</label>
                            <input
                                type="text"
                                id="fName"
                                name="fName"
                                className="border border-gray-300 rounded-full p-2 w-full"
                                required
                                disabled={!isEditable}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
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
                                className="border border-gray-300 rounded-full p-2 w-full"
                                required
                                disabled={!isEditable}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                            className="border border-gray-300 rounded-full p-2"
                            placeholder="Example@gmail.com"
                            required
                            disabled={!isEditable}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {/* end email */}

                    {/* Phone Number */}
                    <div className="flex flex-col text-start">
                        <label htmlFor="tel" className="font-medium">Phone Number</label>
                        <div className="flex flex-col md:flex-row gap-2">

                            {/* Phone Input */}
                            <input
                                type="tel"
                                id="tel"
                                name="tel"
                                className="border border-gray-300 rounded-full p-2 flex-1 w-full"
                                placeholder="Enter your phone number"
                                required
                                disabled={!isEditable}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* end Phone number */}

                    {/* Address */}
                    <div className="flex flex-col text-start font-medium">
                        <label htmlFor="address">Address</label>
                        <textarea name="address" id="address" className="border border-gray-300 rounded-3xl p-2 flex-1 w-full" disabled={!isEditable}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        >
                        </textarea>
                    </div>
                    {/* end Address */}

                    {/* province */}
                    <div className="flex flex-col w-full text-start font-medium">
                        <label htmlFor="province">Province</label>
                        <select name="province" id="province" className="border border-gray-300 rounded-full p-2 text-center"
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
                            <select name="district" id="district" className="border border-gray-300 rounded-full p-2 text-center"
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
                            <select name="subDistrict" id="subDistrict" className="border border-gray-300 rounded-full p-2 text-center"
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
                    <label htmlFor="" className="text-start font-semibold">Upload Organic Certification</label>
                    <div className="flex flex-col md:flex-row items-center justify-start gap-2 border p-2 rounded-full">
                        <label
                            htmlFor="file-upload"
                            className={`cursor-pointer px-4 py-2 bg-[#abc32f] text-white rounded-full hover:bg-[#607c3c] transition ${!isEditable && "opacity-50 cursor-not-allowed"}`}
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
                            disabled={!isEditable}
                            onChange={handleFileUpload}
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
                            className="border border-gray-300 rounded-full p-2 flex-1 w-full"
                            placeholder="Enter a location"
                            disabled={!isEditable}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className="flex items-center justify-center text- md:text-xl bg-[#abc32f] hover: w-full md:w-1/6 rounded-full p-2 px-3 text-white self-center"
                        onClick={handleSubmit}
                    >
                        {isEditable ? "Save" : "Edit"}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default FarmGeneralInfo;