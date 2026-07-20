import { useState } from "react";
import styles from "../../TutorManagement.module.css";

export default // Delete Confirmation Modal Component
function DeleteConfirmationModal({ tutor, onConfirm, onCancel }) {
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
                    <p>Are you sure you want to delete this tutor?</p>
                    <div className={styles.tutorPreview}>
                        <strong>
                            {tutor.name || tutor.user?.name || "Unknown Tutor"}
                        </strong>
                        <br />
                        <span>{tutor.university || "No university"}</span>
                        <br />
                        <span>
                            Courses: {tutor.courses ? tutor.courses.length : 0}
                        </span>
                        <br />
                        <span>
                            Experience: {tutor.experience_years || 0} years
                        </span>
                    </div>
                    <p className={styles.warning}>
                        This action cannot be undone and will affect associated
                        courses and ratings.
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
                        {loading ? "Deleting..." : "Delete Tutor"}
                    </button>
                </div>
            </div>
        </div>
    );
}
