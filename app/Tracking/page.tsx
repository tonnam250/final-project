import Link from "next/link";

const TrackingPage = () => {
    return (
        <div className="flex flex-col w-full h-full min-h-screen pt-24">
            <div className="flex w-full h-full justify-center items-center gap-10 px-4 md:px-0 relative">
                <img src="/images/TracingBg_0.png" alt="" className="w-full" />
                <img src="/images/TrackingRoute3NoBg.png" alt="image_background" className="absolute top-0 w-full" />
            </div>

            {/* Farm */}
            <div className="flex flex-col w-full h-full justify-center items-center">
                <div className="flex w-full h-40 justify-center pl-96 pr-5 border-t border-gray-300">
                    <div className="flex flex-col w-1/12 bg-[#fdeda8] border-b border-r border-gray-300 items-center justify-center text-center">
                        <h1 className="text-2xl">Farm</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 256 256">
                            <path fill="currentColor" d="M136.83 220.43a8 8 0 0 1-11.09 2.23A183.15 183.15 0 0 0 24 192a8 8 0 0 1 0-16a199.1 199.1 0 0 1 110.6 33.34a8 8 0 0 1 2.23 11.09M24 144a8 8 0 0 0 0 16a214.8 214.8 0 0 1 151.17 61.71a8 8 0 1 0 11.2-11.42A230.7 230.7 0 0 0 24 144m208 16a216.5 216.5 0 0 0-48.59 5.49q8.24 6.25 16 13.16A201.5 201.5 0 0 1 232 176a8 8 0 0 1 0 16c-6 0-11.93.29-17.85.86q8.32 8.67 15.94 18.14a8 8 0 1 1-12.48 10A247 247 0 0 0 24 128a8 8 0 0 1 0-16a265.4 265.4 0 0 1 48 4.38V80a8 8 0 0 1 3.2-6.4l64-48a8 8 0 0 1 9.6 0l64 48A8 8 0 0 1 216 80v32.5c5.31-.32 10.64-.5 16-.5a8 8 0 0 1 0 16a246.3 246.3 0 0 0-84.26 14.69q9.44 5 18.46 10.78A232.2 232.2 0 0 1 232 144a8 8 0 0 1 0 16m-103.93-26.73A261.5 261.5 0 0 1 168 119.81V96h-48v34c2.71 1 5.4 2.13 8.07 3.27" />
                        </svg>
                    </div>
                    <div className="flex w-full bg-slate-100 border-b border-gray-300">
                        <div className="flex w-full h-full border-r border-gray-300">
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <p>Farm Name: Farm1</p>
                                <p>Milk Tank: T01</p>
                                <Link href={'/'} className="underline italic" >See more</Link>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <p>Address: </p>
                                <p>Contact: </p>
                            </div>
                        </div>
                        <div className="flex w-full h-full border-r border-gray-300">
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <p>Farm Name: Farm1</p>
                                <p>Milk Tank: T01</p>
                                <Link href={'/'} className="underline italic" >See more</Link>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <p>Address: </p>
                                <p>Contact: </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Factory */}
                <div className="flex w-full h-52 justify-center pl-96 pr-5">
                    <div className="flex flex-col w-1/12 bg-[#fdeda8] border-b border-r border-gray-300 items-center justify-center text-center ">
                        <h1 className="text-2xl">Factory</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M4 22q-.825 0-1.412-.587T2 20v-8.7q0-.6.325-1.1t.9-.75L7.6 7.6q.5-.2.95.075T9 8.5V9l3.625-1.45q.5-.2.937.1t.438.825V10h8v10q0 .825-.587 1.413T20 22zm7-4h2v-4h-2zm-4 0h2v-4H7zm8 0h2v-4h-2zm6.8-9.5h-4.625l.725-5.625q.05-.375.338-.625T18.9 2h1.225q.375 0 .65.25t.325.625z" />
                        </svg>
                    </div>
                    <div className="flex w-full bg-slate-100 border-b border-gray-300 border-r">
                        <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                            <span className="font-semibold">Factory Name:<p className="inline font-normal"> Factory1</p></span>
                            <span className="font-semibold">Product Lot:<p className="inline font-normal"> Lot1</p></span>
                            <span className="font-semibold">Address:<p className="inline font-normal"> </p></span>
                            <span className="font-semibold">Contact:<p className="inline font-normal"> </p></span>
                        </div>
                        <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                            <span className="font-semibold">Quality</span>
                            <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                            <span className="font-semibold">Temperature: <p className="inline font-normal"> 7</p></span>
                            <span className="font-semibold">protein: <p className="inline font-normal"> 7</p></span>
                            <span className="font-semibold">fat: <p className="inline font-normal"> 7</p></span>
                        </div>
                        <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                            <span className="font-semibold">bacteria: <p className="inline font-normal"> Yes</p></span>
                            <span className="font-semibold">Contaminants: <p className="inline font-normal"> Yes</p></span>
                            <span className="font-semibold">Abnormal Characteristic: </span>
                            <span className="font-semibold">Bitter: <p className="inline font-normal"> No</p></span>
                        </div>
                    </div>
                </div>

                {/* Logistic */}
                <div className="flex w-full h-full justify-center pl-96 pr-5">
                    <div className="flex flex-col w-1/12 bg-[#fdeda8] border-r border-b border-gray-300 items-center justify-center text-center ">
                        <h1 className="text-2xl">Logistic</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M13 4a1 1 0 0 1 1 1h4a1 1 0 0 1 .783.378l.074.108l3 5l.055.103l.04.107l.029.109l.016.11L22 11v6a1 1 0 0 1-1 1h-1.171a3.001 3.001 0 0 1-5.658 0H9.829a3.001 3.001 0 0 1-5.658 0H3a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2zM7 16a1 1 0 1 0 0 2a1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2a1 1 0 0 0 0-2m.434-9H14v3h5.234z" />
                        </svg>
                    </div>
                    <div className="flex w-full bg-slate-100 border-gray-300 border-b">
                        <div className="flex flex-col w-full h-full border-r border-gray-300">
                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">Before</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                    <span className="font-semibold">Pickup Time: <p className="inline font-normal"> 24/02/2025 08:00</p></span>
                                    <span className="font-semibold">Delivery Time: <p className="inline font-normal"> 25/02/2025 08:00</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>

                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">During</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                    <span className="font-semibold">Pickup Time: <p className="inline font-normal"> 24/02/2025 08:00</p></span>
                                    <span className="font-semibold">Delivery Time: <p className="inline font-normal"> 25/02/2025 08:00</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>

                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">After</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                    <span className="font-semibold">Pickup Time: <p className="inline font-normal"> 24/02/2025 08:00</p></span>
                                    <span className="font-semibold">Delivery Time: <p className="inline font-normal"> 25/02/2025 08:00</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col w-full h-full border-r border-gray-300">
                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">Before</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>

                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">During</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>

                            <div className="flex w-full h-full">
                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold text-2xl bg-[#ff9a00] w-fit p-1 rounded-xl text-white">After</p>
                                    <span className="font-semibold">Company Name: <p className="inline font-normal"> Company1</p></span>
                                    <span className="font-semibold">Person in charge: <p className="inline font-normal"> John Smith</p></span>
                                </div>

                                <div className="flex flex-col w-full h-full gap-5 p-3 text-xl">
                                    <p className="font-semibold">Quality</p>
                                    <span className="font-semibold">Quantity: <p className="inline font-normal"> 7 Ton</p></span>
                                    <span className="font-semibold">Temperature: <p className="inline font-normal"> 7 Celcius</p></span>
                                    <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                    <span className="font-semibold">Protein: <p className="inline font-normal"> 7%</p></span>
                                    <span className="font-semibold">Fat: <p className="inline font-normal"> 7%</p></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Retailer */}
                <div className="flex w-full h-full justify-center pl-96 pr-5">
                    <div className="flex flex-col w-1/12 bg-[#fdeda8] border-r border-b border-gray-300 items-center justify-center text-center ">
                        <h1 className="text-2xl">Retailer</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.5 11.5v-2h9v2zM4 3a2 2 0 0 0-1 3.732V20.25c0 .414.336.75.75.75H6v-5.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75V21h8.75a.75.75 0 0 0 .75-.75V6.732A2 2 0 0 0 20 3zm-.5 2a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5m3.25 3h10.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75v-3.5A.75.75 0 0 1 6.75 8m8 7h2.5a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75M10 16.5V21H7.5v-4.5z" />
                        </svg>
                    </div>
                    <div className="flex w-full bg-slate-100 border-b border-gray-300">
                        <div className="flex w-1/2 h-full gap-5 p-3 text-xl border-r border-gray-300">
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">Retailer Name:<p className="inline font-normal"> Retailer1</p></span>
                                <span className="font-semibold">Address:<p className="inline font-normal"> </p></span>
                                <span className="font-semibold">Contact:<p className="inline font-normal"> </p></span>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">Quality</span>
                                <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">Temperature: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">protein: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">fat: <p className="inline font-normal"> 7</p></span>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">bacteria: <p className="inline font-normal"> Yes</p></span>
                                <span className="font-semibold">Contaminants: <p className="inline font-normal"> Yes</p></span>
                                <span className="font-semibold">Abnormal Characteristic: </span>
                                <span className="font-semibold">Bitter: <p className="inline font-normal"> No</p></span>
                            </div>
                        </div>
                        <div className="flex w-1/2 h-full gap-5 p-3 text-xl border-r border-gray-300">
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">Retailer Name:<p className="inline font-normal"> Retailer1</p></span>
                                <span className="font-semibold">Address:<p className="inline font-normal"> </p></span>
                                <span className="font-semibold">Contact:<p className="inline font-normal"> </p></span>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">Quality</span>
                                <span className="font-semibold">pH: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">Temperature: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">protein: <p className="inline font-normal"> 7</p></span>
                                <span className="font-semibold">fat: <p className="inline font-normal"> 7</p></span>
                            </div>
                            <div className="flex flex-col w-1/2 h-full gap-5 p-3 text-xl">
                                <span className="font-semibold">bacteria: <p className="inline font-normal"> Yes</p></span>
                                <span className="font-semibold">Contaminants: <p className="inline font-normal"> Yes</p></span>
                                <span className="font-semibold">Abnormal Characteristic: </span>
                                <span className="font-semibold">Bitter: <p className="inline font-normal"> No</p></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;