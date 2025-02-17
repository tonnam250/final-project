import { useState } from 'react';

const Profile = () => {
    const [profileImage, setProfileImage] = useState("/images/profile2.jpg");

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

    return (
        <div className="flex flex-col items-center min-h-screen pt-24 px-10">
            <h1 className="text-5xl font-semibold">Your Profile</h1>
            <div className="flex flex-col items-center gap-4 mt-10">
                <div className="flex flex-col items-center gap-2">
                    <div className="overflow-hidden w-24 h-24 rounded-full">
                        <img src={profileImage} alt="Profile Picture" className="flex justify-center items-center" />
                    </div>
                    <input type="file" className="border" placeholder="Edit" onChange={handleImageChange} />
                    <p className="text-2xl font-semibold">John Doe</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-semibold">Email:</p>
                    <p className="text-lg"></p>
                </div>
            </div>
        </div>
    );
}

export default Profile;