import { getDisplayName } from 'next/dist/shared/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Profile = () => {
    const [profileImage, setProfileImage] = useState("/images/ProfileDefault.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [role, setRole] = useState("")
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/');
            return;
        }

        try {
            const res = await axios.get('/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                baseURL: process.env.NEXT_PUBLIC_API_URL,
            });

            console.log('User Data: ', res.data);
            setEmail(res.data.email);
            setRole(res.data.role);
            setPhone(res.data.phone);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setProfileImage(e.target.result as string);
                }
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSignOut = () => {
        router.push('/');
    };

    return (
        <div className="flex flex-col items-center min-h-screen pt-24 px-10 p-10 bg-slate-100">
            <div className='flex flex-col items-center gap-4 bg-white w-3/4 border rounded-3xl p-10 shadow-xl '>
                <h1 className="text-5xl font-semibold">Your Profile</h1>
                <div className="flex justify-center w-full items-center gap-10 mt-10">
                    <div className="flex flex-col items-center gap-5 w-1/2">
                        <div className="flex justify-center items-center overflow-hidden w-56 h-56 rounded-full">
                            <img src={profileImage} alt="Profile Picture" className="flex justify-center items-center rounded-full" />
                        </div>
                        <label className="cursor-pointer bg-emerald-400 text-white py-2 px-4 rounded-full hover:bg-green-700">
                            <input type="file" className="hidden" onChange={handleImageChange} />
                            Choose Profile Image
                        </label>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-1/2">
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Email:</p>
                            <p className="text-lg text-left w-32">{email}</p>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Password:</p>
                            <div className='flex gap-2 w-32'>
                                <p className="text-lg text-left w-full">********</p>
                            </div>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Role:</p>
                            <p className="text-lg text-left w-32">{role}</p>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Phone:</p>
                            <p className="text-lg text-left w-32">{phone}</p>
                        </div>
                    </div>
                </div>
                <div className='flex items-center justify-center gap-4 w-full mt-10'>
                    <button type='button' onClick={handleSignOut} className='flex text-center border-2 rounded-full border-red-500 p-1 px-2 text-red-500 w-fit gap-2 hover:bg-red-500 hover:text-white'>
                        Sign out
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-7 w-7 inline' viewBox="0 0 24 24">
                            <g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M15.99 7.823a.75.75 0 0 1 1.061.021l3.49 3.637a.75.75 0 0 1 0 1.038l-3.49 3.637a.75.75 0 0 1-1.082-1.039l2.271-2.367h-6.967a.75.75 0 0 1 0-1.5h6.968l-2.272-2.367a.75.75 0 0 1 .022-1.06" /><path d="M3.25 4A.75.75 0 0 1 4 3.25h9.455a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0V4.75H4.75v14.5h7.954V17a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75z" /></g>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;