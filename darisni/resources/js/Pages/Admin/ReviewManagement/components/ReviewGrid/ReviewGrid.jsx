import styles from "./ReviewGrid.module.css";

import ReviewCard from "../ReviewCard/ReviewCard";


export default function ReviewGrid({
    reviews,
    onDelete,
    processingId,
}) {

    if (reviews.length === 0) {
        return (
            <div className={styles.emptyState}>

                <div className={styles.emptyIcon}>
                    📝
                </div>


                <h3>
                    No reviews found
                </h3>


                <p>
                    No reviews match your current
                    filter and search criteria.
                </p>

            </div>
        );
    }


    return (
        <div className={styles.reviewsGrid}>

            {reviews.map((review) => (

                <ReviewCard
                    key={`${review.type}-${review.id}`}
                    review={review}
                    onDelete={onDelete}
                    processingId={processingId}
                />

            ))}

        </div>
    );
}