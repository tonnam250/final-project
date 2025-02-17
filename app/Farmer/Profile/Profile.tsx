import { useState } from 'react';

const Profile = () => {
    const [profileImage, setProfileImage] = useState("/images/profile2.jpg");
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("johndoe");
    const [password, setPassword] = useState("12345");
    const [role, setRole] = useState("Farmer");
    const [email, setEmail] = useState("jdoe@gmail.com");
    const [phone, setPhone] = useState("+1234567890");
    const [showPassword, setShowPassword] = useState(false);

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

    return (
        <div className="flex flex-col items-center min-h-screen pt-24 px-10 p-10 bg-slate-100">
            <div className='flex flex-col items-center gap-4 bg-white w-3/4 border rounded-3xl p-10 shadow-xl '>
                <h1 className="text-5xl font-semibold">Your Profile</h1>
                <div className="flex flex-col items-center gap-4 mt-10">
                    <div className="flex flex-col items-center gap-5">
                        <div className="overflow-hidden w-24 h-24 rounded-full">
                            <img src={profileImage} alt="Profile Picture" className="flex justify-center items-center" />
                        </div>
                        <label className="cursor-pointer bg-emerald-400 text-white py-2 px-4 rounded-full hover:bg-green-700">
                            <input type="file" className="hidden" onChange={handleImageChange} />
                            Choose Profile Image
                        </label>
                        <p className="text-2xl font-semibold">John Doe</p>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Username:</p>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{username}</p>
                            )}
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Password:</p>
                            <div className='flex gap-2 w-32'>
                                {isEditing ? (
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="text-lg text-left w-full border-b-2 border-gray-300 focus:outline-none"
                                    />
                                ) : (
                                    <p className="text-lg text-left w-full">{showPassword ? password : "*****"}</p>
                                )}
                                <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-500">
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Role:</p>
                            <p className="text-lg text-left w-32">{role}</p>
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Email:</p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{email}</p>
                            )}
                        </div>
                        <div className="flex justify-between gap-6 w-full">
                            <p className="text-lg font-bold">Phone:</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="text-lg text-left w-32 border-b-2 border-gray-300 focus:outline-none"
                                />
                            ) : (
                                <p className="text-lg text-left w-32">{phone}</p>
                            )}
                        </div>
                    </div>
                </div>
                <button type="button" onClick={handleEditClick} className='bg-emerald-400 p-2 text-white rounded-full w-16 hover:bg-green-700'>
                    {isEditing ? "Save" : "Edit"}
                </button>
            </div>
        </div>
    );
}

export default Profile;