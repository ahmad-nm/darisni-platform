import { useState, useEffect } from 'react';
import style from './TutorProfile.module.css';

export function TutorProfile({ tutor }) {
    const [currentReview, setCurrentReview] = useState(0);
    const [mouseOnSlider, setMouseOnSlider] = useState(false);
    const [tutorReviews, setTutorReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    // Ensure reviews exist and is an array - from API or relationship
    const rawReviews = tutorReviews.length > 0 ? tutorReviews : (Array.isArray(tutor?.reviews) ? tutor.reviews : []);
    
    // Transform all reviews to ensure consistent format
    const reviews = rawReviews.map(review => ({
        user: typeof review.user === 'string' ? review.user : (review.user?.name || 'Anonymous'),
        comment: review.comment || review.feedback || 'No comment',
        rating: review.rating || 0
    }));
    
    const tutorImage = tutor?.image || '/images/default-tutor.svg';
    const tutorName = tutor?.name || tutor?.user?.name || 'Tutor';

    // Fetch tutor reviews when component mounts
    useEffect(() => {
        if (tutor?.id && tutorReviews.length === 0) {
            const fetchTutorReviews = async () => {
                setReviewsLoading(true);
                try {
                    const response = await fetch(`/api/reviews/tutor/${tutor.id}`);
                    const data = await response.json();
                    
                    if (data.success && data.data.reviews) {
                        // Transform the reviews to match expected format
                        const transformedReviews = data.data.reviews.map(review => ({
                            user: review.user?.name || 'Anonymous',
                            comment: review.comment || review.feedback || 'No comment',
                            rating: review.rating || 0
                        }));
                        setTutorReviews(transformedReviews);
                    }
                } catch (error) {
                    console.error('Error fetching tutor reviews:', error);
                } finally {
                    setReviewsLoading(false);
                }
            };

            fetchTutorReviews();
        }
    }, [tutor?.id, tutorReviews.length]);

    const handleMouseEnter = () => {
        setMouseOnSlider(true);
    };

    const handleMouseLeave = () => {
        setMouseOnSlider(false);
    };

    // Auto-slide functionality
    useEffect(() => {
        if (reviews.length <= 1) return;

        if (mouseOnSlider) return;

        const interval = setInterval(() => {
            setCurrentReview((prev) => 
                prev === reviews.length - 1 ? 0 : prev + 1
            );
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [reviews.length, mouseOnSlider]);

    const nextReview = () => {
        setCurrentReview((prev) => 
            prev === reviews.length - 1 ? 0 : prev + 1
        );
    };

    const prevReview = () => {
        setCurrentReview((prev) => 
            prev === 0 ? reviews.length - 1 : prev - 1
        );
    };

    return (
        <div className={style.tutorProfile}>
            <img src={tutorImage} alt={`${tutorName}'s profile`} className={style.tutorImage} />
            
            <div className={style.ratingInfo}>
                <div className={style.reviewsSlider} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className={style.sliderHeader}>
                        <p>Reviews:</p>
                        {reviews.length > 1 && (
                            <div className={style.sliderNav}>
                                <button onClick={prevReview} className={style.navBtn}>‹</button>
                                <span className={style.counter}>{currentReview + 1}/{reviews.length}</span>
                                <button onClick={nextReview} className={style.navBtn}>›</button>
                            </div>
                        )}
                    </div>

                    <div className={style.reviewContainer}>
                        {reviewsLoading ? (
                            <div className={style.loadingReviews}>
                                <p>Loading reviews...</p>
                            </div>
                        ) : reviews.length > 0 ? (
                            <div
                                className={style.reviewTrack}
                                style={{ transform: `translateX(-${currentReview * 100}%)` }}
                            >
                                {reviews.map((review, index) => (
                                    <div key={index} className={style.reviewSlide}>
                                        <div className={style.reviewContent}>
                                            <strong>{review.user}:</strong> {review.comment} 
                                            <span className={style.stars}>({review.rating} ★)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={style.noReviews}>
                                <p>No reviews yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}