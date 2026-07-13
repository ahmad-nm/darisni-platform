import style from "../CourseInfoCard.module.css";

export function CourseReviews({
    toggleReviews,
    handleToggle,
    reviewsLoading,
    courseReviews,
    goToPrevious,
    goToNext,
    scrollRef,
}) {
    return (
        <div className={style.reviewToggle}>
            <button
                onClick={handleToggle}
                className={`${style.reviewsToggleButton} ${toggleReviews ? style.active : style.slideBack}`}
            >
                {toggleReviews ? "Hide Reviews ↑" : "Show Reviews ↓"}
            </button>

            <div
                className={`${style.courseReviews} ${toggleReviews ? style.slideIn : style.slideOut}`}
            >
                {toggleReviews && (
                    <div className={style.reviewCarousel}>
                        {reviewsLoading ? (
                            <p className={style.loadingReviews}>
                                Loading reviews...
                            </p>
                        ) : courseReviews.length > 0 ? (
                            <>
                                <button
                                    className={`${style.navArrow} ${style.prevArrow}`}
                                    onClick={goToPrevious}
                                    aria-label="Previous review"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M15 18L9 12L15 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <div
                                    ref={scrollRef}
                                    className={style.reviewsWrapper}
                                >
                                    {courseReviews.map((review, index) => (
                                        <CourseReviewCard
                                            key={index}
                                            review={review}
                                        />
                                    ))}
                                </div>

                                <button
                                    className={`${style.navArrow} ${style.nextArrow}`}
                                    onClick={goToNext}
                                    aria-label="Next review"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M9 18L15 12L9 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <p className={style.noReviews}>
                                No reviews available for this course.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
