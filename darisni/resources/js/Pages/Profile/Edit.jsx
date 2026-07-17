import { useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { Navbar } from '../../Components/navBar/nav';
import DeleteUserForm from './Components/DeleteUserForm/DeleteUserForm';
import UpdatePasswordForm from './Components/UpdatePasswordForm/UpdatePasswordForm';
import UpdateProfileInformationForm from './Components/UpdateProfileInfo/UpdateProfileInformationForm';
import style from './Edit.module.css';
import ProfileHeader from './Components/ProfileHeader/ProfileHeader';
import SectionCard from './Components/SectionCard/SectionCard';
import { useAuth } from '@/contexts/AuthContext';
import { deleteProfileImage, updateProfileImage } from '@/services/profileService';

export default function Edit({ mustVerifyEmail, status }) {
    const { user } = useAuth();
    const fileInputRef = useRef();

    const handleAddImage = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            await updateProfileImage(formData);

            router.reload({ only: ["auth"] });
        } catch (errors) {
            console.error(errors);
        }
    };

    const handleDeleteImage = async () => {
        try {
            await deleteProfileImage();

            router.reload({ only: ["auth"] });
        } catch (errors) {
            console.error(errors);
        }
    };

    return (
        <div className={style.profileContainer}>
            <Head title="Profile Settings" />
            
            <Navbar />
            
            <div className={style.profileContent}>
                <ProfileHeader
                    user={user}
                    handleAddImage={handleAddImage}
                    handleImageChange={handleImageChange}
                    handleDeleteImage={handleDeleteImage}
                    fileInputRef={fileInputRef}
                />

                <div className={style.profileSections}>
                    <SectionCard
                        icon="👤"
                        title="Personal Information"
                        description="Update your account's profile information and email address."
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </SectionCard>

                    <SectionCard
                        icon="🔒"
                        title="Password & Security"
                        description="Ensure your account is using a long, random password to stay secure."
                    >
                        <UpdatePasswordForm />
                    </SectionCard>

                    <SectionCard
                        danger
                        icon="⚠️"
                        title="Danger Zone"
                        description="Once your account is deleted, all of its resources and data will be permanently deleted."
                    >
                        <DeleteUserForm />
                    </SectionCard>
                </div>
            </div>
        </div>
    );
}
