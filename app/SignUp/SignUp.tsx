"use client";

import { useRouter } from "next/navigation";

const SignUp = () => {

    const router = useRouter();

    return (
        <div className="flex flex-col w-full h-full bg-[url('/images/CowBg.jpg')] min-h-screen bg-cover bg-center bg-[#3D405B] bg-blend-overlay bg-opacity-80 overflow-hidden justify-center items-center pt-20">
            {/* SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-20 z-10">
                <path fill="#3D405B" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>

            {/* Form */}
            <div className="flex flex-col w-full h-full justify-center items-center gap-10 z-30">
                <h1 className="text-5xl font-bold text-white">Sign Up</h1>
                <form className="flex flex-col gap-5 w-full justify-center items-center">
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="fullName" className="text-white self-start font-semibold">Full Name</label>
                        <input type="text" placeholder="Full Name" name="fullName" id="fullName" className="p-2 rounded-full w-full border-2" />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="email" className="text-white self-start font-semibold">Email</label>
                        <input type="email" placeholder="Email" name="email" id="email" className="p-2 rounded-full w-full border-2" />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="password" className="text-white self-start font-semibold">Password</label>
                        <input type="password" placeholder="Password" className="p-2 rounded-full w-full border-2" />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="confirmPassword" className="text-[#3D405B] self-start font-semibold">Confirm Password</label>
                        <input type="password" placeholder="Confirm Password" className="p-2 rounded-full w-full border-2" />
                    </div>
                    <button type="button" className="p-2 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-[#EFE4DC] rounded-full"
                        onClick={() => router.push('/SignUp/SelectRole')}>
                        Sign Up
                    </button>
                </form>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -bottom-20 z-10 -scale-y-[1] -scale-x-[1]">
                <path fill="#FFFFFF" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>
        </div>
    );
}
export default SignUp;