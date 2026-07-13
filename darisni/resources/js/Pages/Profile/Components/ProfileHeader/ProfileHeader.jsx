import style from './ProfileHeader.module.css';

export default function ProfileHeader(
    { 
        user, 
        handleAddImage,
        handleImageChange,
        handleDeleteImage, 
        fileInputRef 
    }
) {
    return (
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
    )
}