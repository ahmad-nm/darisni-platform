import styles from "./ReviewCard.module.css";

import {
    formatDate,
    getReviewTypeIcon,
    getReviewTypeColor,
} from "../../../../../utils/reviewHelpers";

export default function ReviewCard({ review, onDelete, processingId }) {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                className={
                    index < rating ? styles.starFilled : styles.starEmpty
                }
            >
                ⭐
            </span>
        ));
    };

    return (
        <div className={styles.reviewCard}>
            {/* Header */}

            <div className={styles.reviewHeader}>
                <div className={styles.reviewType}>
                    <span
                        className={styles.typeIcon}
                        style={{
                            backgroundColor: getReviewTypeColor(review.type),
                        }}
                    >
                        {getReviewTypeIcon(review.type)}
                    </span>

                    <span className={styles.typeName}>
                        {review.subject?.type || "Review"}
                    </span>
                </div>

                <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(review)}
                    disabled={processingId === review.id}
                    title="Delete Review"
                >
                    {processingId === review.id ? "⏳" : "🗑️"}
                </button>
            </div>

            {/* Content */}

            <div className={styles.reviewContent}>
                <div className={styles.subjectInfo}>
                    <h4 className={styles.subjectTitle}>
                        {review.subject?.title || "Unknown"}
                    </h4>

                    <span className={styles.subjectCode}>
                        {review.subject?.code || ""}
                    </span>
                </div>

                <div className={styles.rating}>
                    {renderStars(review.rating)}

                    <span className={styles.ratingValue}>
                        ({review.rating})
                    </span>
                </div>

                {review.feedback && (
                    <div className={styles.feedback}>
                        <p>"{review.feedback}"</p>
                    </div>
                )}

                <div className={styles.reviewMeta}>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>
                            👤 {review.user?.name || "Anonymous"}
                        </span>

                        <span className={styles.userEmail}>
                            {review.user?.email || ""}
                        </span>
                    </div>

                    <div className={styles.reviewDate}>
                        {formatDate(review.created_at)}
                    </div>
                </div>
            </div>
        </div>
    );
}
