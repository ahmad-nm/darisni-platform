import { useState } from "react";
import styles from "../CourseManagement.module.css";

export default function DeleteConfirmationModal({ course, onConfirm, onCancel }) {
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
                    <p>Are you sure you want to delete this course?</p>
                    <div className={styles.coursePreview}>
                        <strong>{course.title}</strong>
                        <br />
                        <span>Code: {course.code}</span>
                        <br />
                        <span>
                            Price: {course.price ? `$${course.price}` : "Free"}
                        </span>
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
                        {loading ? "Deleting..." : "Delete Course"}
                    </button>
                </div>
            </div>
        </div>
    );
}
