"use client";

import React, { useState } from "react";


const FarmGeneralInfo = () => {
    const [fileNames, setFileNames] = useState<string[]>(["No file selected."]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files).map((file) => file.name);
            setFileNames(files.length ? files : ["ยังไม่ได้เลือกไฟล์"]);
        } else {
            setFileNames(["ยังไม่ได้เลือกไฟล์"]);
        }
    };

    return (
        <div className="flex flex-col text-center w-full justify-center items-center">
            <h1 className="text-4xl font-bold my-8">General Information</h1>
            <div className="flex h-full w-8/12 h-11/12 p-5 shadow-xl justify-center items-center border rounded-2xl m-5">
                <form action="" className="flex flex-col gap-4 w-full">
                    <div className="flex flex-row gap-5 text-start w-full">

                        {/* first name */}
                        <div className="flex flex-col text-start w-6/12">
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
                        <div className="flex flex-col text-start w-6/12">
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
                        <div className="flex flex-row gap-2">

                            {/* Area Code */}
                            <div className="flex flex-col">
                                <label htmlFor="areaCode" className="sr-only">Area Code</label>
                                <select
                                    name="areaCode"
                                    id="areaCode"
                                    className="border border-gray-300 rounded-md p-2 w-20 text-center"
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
                        <select name="province" id="province" className="border border-gray-300 rounded-md p-2 text-center">
                            <option value="">Province</option>
                        </select>
                    </div>
                    {/* end province */}

                    {/* district + Sub-District */}
                    <div className="flex flex-row w-full gap-4">
                        <div className="flex flex-col text-start font-medium w-6/12">
                            <label htmlFor="district">District</label>
                            <select name="district" id="district" className="border border-gray-300 rounded-md p-2 text-center">
                                <option value="bangkholaem">bang kho laem</option>
                            </select>
                        </div>

                        <div className="flex flex-col text-start font-medium w-6/12">
                            <label htmlFor="subDistrict">Sub-District</label>
                            <select name="subDistrict" id="subDistrict" className="border border-gray-300 rounded-md p-2 text-center">
                                <option value="ิbangkholaem">bang kho laem</option>
                            </select>
                        </div>
                    </div>
                    {/* end district + sub-district */}

                    {/* Upload Organic certification */}
                    <div className="flex items-center justify-start gap-2 border p-2">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-4 py-2 bg-[#abc32f] text-white rounded-lg hover:bg-[#607c3c] transition"
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
                </form>
            </div>
        </div>
    );
};

export default FarmGeneralInfo;