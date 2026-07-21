import styles from "./DeleteConfirmationModal.module.css";

export default function DeleteConfirmationModal({
    review,
    onConfirm,
    onCancel,
    processing,
}) {
    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div
                className={styles.deleteModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteModalHeader}>
                    <h3>Confirm Delete Review</h3>
                </div>

                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this review?</p>

                    <div className={styles.reviewPreview}>
                        <div className={styles.previewHeader}>
                            <span className={styles.reviewTypeLabel}>
                                {review.subject?.type} Review
                            </span>

                            <div className={styles.previewRating}>
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={
                                            index < review.rating
                                                ? styles.starFilled
                                                : styles.starEmpty
                                        }
                                    >
                                        ⭐
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.previewContent}>
                            <strong>{review.subject?.title}</strong>

                            <p className={styles.previewUser}>
                                By: {review.user?.name}
                            </p>

                            {review.feedback && (
                                <p className={styles.previewFeedback}>
                                    "{review.feedback}"
                                </p>
                            )}
                        </div>
                    </div>

                    <p className={styles.warning}>
                        This action cannot be undone.
                    </p>
                </div>

                <div className={styles.deleteModalActions}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelBtn}
                        disabled={processing}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={styles.deleteConfirmBtn}
                        disabled={processing}
                    >
                        {processing ? "Deleting..." : "Delete Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}
