"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

const SignUp = () => {

    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('/auth/sign-up', { fullName, email, phone, password }, {
                baseURL: process.env.NEXT_PUBLIC_API_URL,
            });

            console.log('Response: ', res.data);

            if (res.status === 200) {
                localStorage.setItem('token', res.data.token);
                console.log('Token set, redirecting to /SignUp/SelectRole');
                router.push('/SignUp/SelectRole');
            } else {
                console.log('Unexpected status code: ', res.data.status);
                console.log('response: ', res.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            console.log('Error: ', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-[url('/images/CowBg.jpg')] min-h-screen bg-cover bg-center bg-[#3D405B] bg-blend-overlay bg-opacity-80 overflow-hidden justify-center items-center pt-20">
            {/* SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -top-20 z-10">
                <path fill="#3D405B" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
            </svg>

            {/* Form */}
            <div className="flex flex-col w-full h-full justify-center items-center gap-10 z-30">
                <h1 className="text-5xl font-bold text-white">Sign Up</h1>
                {error && <div className='text-red-500 text-xl'>{error}</div>}
                <form className="flex flex-col gap-5 w-full justify-center items-center">
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="fullName" className="text-white self-start font-semibold">Full Name</label>
                        <input type="text" placeholder="Full Name" name="fullName" id="fullName" className="p-2 rounded-full w-full border-2"
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="email" className="text-white self-start font-semibold">Email</label>
                        <input type="email" placeholder="Email" name="email" id="email" className="p-2 rounded-full w-full border-2"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="phone" className="text-white self-start font-semibold">Phone</label>
                        <input type="text" placeholder="Phone number" name="phone" id="phone" className="p-2 rounded-full w-full border-2"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="password" className="text-white self-start font-semibold">Password</label>
                        <input type="password" placeholder="Password" className="p-2 rounded-full w-full border-2"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 justify-center items-center text-lg">
                        <label htmlFor="confirmPassword" className="text-white self-start font-semibold">Confirm Password</label>
                        <input type="password" placeholder="Confirm Password" className="p-2 rounded-full w-full border-2"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="p-2 text-xl font-semibold bg-[#f2cc8f] hover:bg-[#ffa850] text-[#EFE4DC] rounded-full"
                        disabled={loading} onClick={handleSubmit}>
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default SignUp;