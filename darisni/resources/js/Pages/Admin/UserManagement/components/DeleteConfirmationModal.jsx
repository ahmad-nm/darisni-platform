import React, { useState } from "react";
import styles from "../UserManagement.module.css";

export default function DeleteConfirmationModal({ user, onConfirm, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div
                className={styles.deleteModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteModalHeader}>
                    <h2>Confirm Delete</h2>
                </div>

                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this user?</p>

                    <div className={styles.userPreview}>
                        <strong>{user.name}</strong>
                        <br />
                        <span>{user.email}</span>
                        <br />
                        <span className={styles.roleTag}>{user.role}</span>
                    </div>

                    <p className={styles.warning}>
                        This action cannot be undone.
                    </p>
                </div>

                <div className={styles.deleteModalActions}>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={styles.deleteConfirmBtn}
                    >
                        {loading ? "Deleting..." : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
