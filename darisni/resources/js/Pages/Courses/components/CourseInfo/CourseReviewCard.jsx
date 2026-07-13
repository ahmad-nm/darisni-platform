import style from './CourseReviewCard.module.css';
import RatingStar from '../../../../assets/Icons/testStar.png';
import EmptyStar from '../../../../assets/Icons/testStarEmpty.png';

export function CourseReviewCard({ review }) {
    const validRating = Math.max(0, Math.min(5, parseInt(review.rating) || 0));

    // Get user information from the review.user relationship
    const userName = review.user?.name || review.name || 'Anonymous';
    const userImage = review.user?.image || review.image || '/images/default-avatar.svg';
    const reviewText = review.feedback || review.testimonial || '';

    return (        
        <div className={style.reviewItem}>
            <div className={style.userInfo}>
                <img src={userImage} alt={userName} className={style.reviewImage} />
                <span className={style.reviewUsername}>{userName}</span>
            </div>

            <p className={style.reviewText}>"{reviewText}"</p>
            
            <div className={style.reviewRating}>
                {[...Array(validRating)].map((_, rateIndex) => (
                    <span key={rateIndex} className={style.star}><img src={RatingStar} alt='star' /></span>
                ))}
                {[...Array(5 - validRating)].map((_, emptyIndex) => (
                    <span key={emptyIndex} className={style.emptyStar}><img src={EmptyStar} alt='Empty Star' /></span>
                ))}
            </div>
        </div>
    );
}