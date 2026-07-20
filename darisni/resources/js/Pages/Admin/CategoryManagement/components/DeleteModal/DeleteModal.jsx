import { useState } from "react";
import styles from "./DeleteModal.module.css";

export default function DeleteConfirmationModal({ category, onConfirm, onCancel }) {
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
                    <p>Are you sure you want to delete this category?</p>
                    <div className={styles.categoryPreview}>
                        <strong>{category.name}</strong>
                        <br />
                        <span>{category.description || "No description"}</span>
                        <br />
                        <span>Courses: {category.courses_count || 0}</span>
                    </div>
                    <p className={styles.warning}>
                        This action cannot be undone and will affect associated
                        courses.
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
                        {loading ? "Deleting..." : "Delete Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}