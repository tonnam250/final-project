"use client";
import { useRouter } from "next/navigation";

const SelectRole = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col w-full h-full bg-[url('/images/CowBg.jpg')] min-h-screen bg-cover bg-center bg-[#3D405B] bg-blend-overlay bg-opacity-80 overflow-hidden justify-center items-center pt-20">
            {/* SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-20 z-10">
                <path fill="#3D405B" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>

            {/* Select Role */}
            <div className="flex flex-col w-full h-full justify-center items-center gap-10 z-30 px-4 md:px-0">
                <h1 className="text-3xl md:text-5xl font-bold text-white">Choose Role</h1>
                <div className="flex flex-col md:flex-row gap-5 w-full h-full justify-center items-center p-5 md:p-10">
                    <div className="flex flex-col gap-2 w-full md:w-1/2 h-auto justify-center items-center text-center text-lg bg-white border shadow-xl rounded-3xl p-5">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden">
                            <img src="/images/FarmerAvatar3.png" alt="farmer avatar" />
                        </div>
                        <label className="text-[#3D405B] font-bold text-2xl">Farmer</label>
                        <p className="text-[#3D405B] font-semibold text-xl">Manage farm date and organic milk production</p>
                        <button type="button" className="p-2 px-3 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-white rounded-full"
                            onClick={() => router.push('/Farmer/FarmGeneralInfo')}>
                            Select
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-1/2 h-auto justify-center items-center text-center text-lg bg-white border shadow-xl rounded-3xl p-5">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden">
                            <img src="/images/factoryAvatar.png" alt="farmer avatar" />
                        </div>
                        <label className="text-[#3D405B] font-bold text-2xl">Factory</label>
                        <p className="text-[#3D405B] font-semibold text-xl">Recieve and process raw milk, ensuring quality and packing</p>
                        <button type="button" className="p-2 px-3 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-white rounded-full"
                            onClick={() => router.push('/Factory/FactoryGeneral')}>
                            Select
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-5 w-full h-full justify-center items-center p-5 md:p-10">
                    <div className="flex flex-col gap-2 w-full md:w-1/2 h-auto justify-center items-center text-center text-lg bg-white border shadow-xl rounded-3xl p-5">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden">
                            <img src="/images/logisAvatar.webp" alt="farmer avatar" />
                        </div>
                        <label className="text-[#3D405B] font-bold text-2xl">Logistic</label>
                        <p className="text-[#3D405B] font-semibold text-xl">Transport and track shipments in real-time</p>
                        <button type="button" className="p-2 px-3 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-white rounded-full"
                            onClick={() => router.push('/Logistic/GeneralInfo')}>
                            Select
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-1/2 h-auto justify-center items-center text-center text-lg bg-white border shadow-xl rounded-3xl p-5">
                        <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden">
                            <img src="/images/factoryAvatar.png" alt="farmer avatar" />
                        </div>
                        <label className="text-[#3D405B] font-bold text-2xl">Retailer</label>
                        <p className="text-[#3D405B] font-semibold text-xl">Recieve products and verify accuracy before selling to customers</p>
                        <button type="button" className="p-2 px-3 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-white rounded-full"
                            onClick={() => router.push('/Retail/GeneralInfo')}>
                            Select
                        </button>
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -bottom-56 z-10 -scale-y-[1] -scale-x-[1]">
                <path fill="#FFFFFF" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>
        </div>
    );
};
export default SelectRole;