import { useRef } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Navbar } from '../../Components/navBar/nav';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import style from './Edit.module.css';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const fileInputRef = useRef();

    const handleAddImage = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/admin/users/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData
            });
            const data = await response.json();
            if (data.url) {
                // Now update the user profile with the new image URL
                router.post('/profile/image', { image: data.url }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.reload({ only: ['auth'] });
                    },
                });
            } else {
                alert('Failed to upload image.');
            }
        } catch (error) {
            alert('Image upload failed.');
        }
    };

    const handleDeleteImage = () => {
        router.post('/profile/image/delete', {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['auth'] });
            },
        });
    };

    return (
        <div className={style.profileContainer}>
            <Head title="Profile Settings" />
            
            <Navbar />
            
            <div className={style.profileContent}>
                <div className={style.profileHeader}>
                    <div className={style.headerContent}>
                        <div className={style.userInfo}>
                            <div className={style.avatarContainer}>
                                <div className={style.avatar} onClick={handleAddImage}>
                                    <img 
                                        src={user?.image || '/images/default-avatar.svg'} 
                                        alt={user?.name || 'User'} 
                                        className={style.avatarImage}
                                    />
                                    <div className={style.avatarOverlay}>
                                        <span className={style.changePhoto}>📷</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {user?.image && (
                                    <button className={style.deleteImageButton} onClick={handleDeleteImage}>
                                        -
                                    </button>
                                )}
                            </div>
                            <div className={style.userDetails}>
                                <h1 className={style.userName}>{user?.name || 'User'}</h1>
                                <p className={style.userEmail}>{user?.email}</p>
                                <span className={style.userRole}>{user?.role || 'Student'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.profileSections}>
                    <div className={style.sectionCard}>
                        <div className={style.sectionHeader}>
                            <h2 className={style.sectionTitle}>
                                <span className={style.sectionIcon}>👤</span>
                                Personal Information
                            </h2>
                            <p className={style.sectionDescription}>
                                Update your account's profile information and email address.
                            </p>
                        </div>
                        <div className={style.sectionContent}>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    <div className={style.sectionCard}>
                        <div className={style.sectionHeader}>
                            <h2 className={style.sectionTitle}>
                                <span className={style.sectionIcon}>🔒</span>
                                Password & Security
                            </h2>
                            <p className={style.sectionDescription}>
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                        </div>
                        <div className={style.sectionContent}>
                            <UpdatePasswordForm />
                        </div>
                    </div>

                    <div className={`${style.sectionCard} ${style.dangerZone}`}>
                        <div className={style.sectionHeader}>
                            <h2 className={style.sectionTitle}>
                                <span className={style.sectionIcon}>⚠️</span>
                                Danger Zone
                            </h2>
                            <p className={style.sectionDescription}>
                                Once your account is deleted, all of its resources and data will be permanently deleted.
                            </p>
                        </div>
                        <div className={style.sectionContent}>
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
