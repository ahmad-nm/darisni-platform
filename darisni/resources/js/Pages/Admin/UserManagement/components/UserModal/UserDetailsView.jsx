import React from "react";
import styles from "../../UserManagement.module.css";

export default function UserDetailsView({ user, onClose, onEdit }) {
    return (
        <div className={styles.userDetailsView}>
            <div className={styles.userProfileSection}>
                <div className={styles.userAvatarLarge}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userBasicInfo}>
                    <h3>{user.name}</h3>
                    <p className={styles.userEmailLarge}>{user.email}</p>
                    <span
                        className={`${styles.userRoleBadge} ${styles["role" + user.role.charAt(0).toUpperCase() + user.role.slice(1)]}`}
                    >
                        {user.role.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className={styles.userInfoGrid}>
                <div className={styles.infoItem}>
                    <label>User ID</label>
                    <span>#{user.id}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Account Status</label>
                    <span
                        className={`${styles.statusIndicator} ${user.email_verified_at !== null ? styles.statusActive : styles.statusInactive}`}
                    >
                        {user.email_verified_at !== null
                            ? "✓ Active"
                            : "✗ Inactive"}
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Email Verification</label>
                    <span
                        className={`${styles.verificationStatus} ${user.email_verified_at ? styles.verified : styles.unverified}`}
                    >
                        {user.email_verified_at ? "✓ Verified" : "✗ Unverified"}
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Email Verified At</label>
                    <span>
                        {user.email_verified_at
                            ? new Date(user.email_verified_at).toLocaleString()
                            : "Not verified"}
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Member Since</label>
                    <span>
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Last Updated</label>
                    <span>
                        {new Date(
                            user.updated_at || user.created_at,
                        ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Account Age</label>
                    <span>
                        {Math.floor(
                            (new Date() - new Date(user.created_at)) /
                                (1000 * 60 * 60 * 24),
                        )}{" "}
                        days
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Profile Image</label>
                    <span>
                        {user.image
                            ? "Has profile picture"
                            : "No profile picture"}
                    </span>
                </div>
            </div>

            <div className={styles.modalActions}>
                <button onClick={onClose} className={styles.cancelBtn}>
                    Close
                </button>
                <button
                    onClick={() => {
                        setModalMode("edit");
                    }}
                    className={styles.editFromViewBtn}
                >
                    Edit User
                </button>
            </div>
        </div>
    );
}
