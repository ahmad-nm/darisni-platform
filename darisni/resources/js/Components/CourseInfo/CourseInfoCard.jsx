import { CourseReviewCard } from './CourseReviewCard.jsx';
import { useState, useRef } from 'react';
import { RatingModal } from '../RatingModal/RatingModal';
import cartIcon from '../../assets/Icons/cart.png';
import style from './CourseInfoCard.module.css';
import { Link } from '@inertiajs/react';

export function CourseInfoCard({ course, onAddToCart, specialCategory }) {
    const [toggleReviews, setToggleReviews] = useState(false);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [courseReviews, setCourseReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showAllChapters, setShowAllChapters] = useState(false);
    const scrollRef = useRef(null);
    
    const handleToggle = async () => {
        if (!toggleReviews && courseReviews.length === 0) {
            // Fetch reviews when opening for the first time
            setReviewsLoading(true);
            try {
                const response = await fetch(`/api/reviews/course/${course.id}`);
                const data = await response.json();
                if (data.success) {
                    setCourseReviews(data.data.reviews || []);
                }
            } catch (error) {
                console.error('Error fetching course reviews:', error);
            } finally {
                setReviewsLoading(false);
            }
        }
        setToggleReviews(!toggleReviews);
    };

    const handleRatingSubmitted = () => {
        console.log('Course rating submitted successfully!');
    };

    const scrollToReview = (index) => {
        if (scrollRef.current && courseReviews.length > 0) {
            const reviewWidth = 400;
            const scrollPosition = index * reviewWidth;
            scrollRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            setCurrentReviewIndex(index);
        }
    };

    const goToPrevious = () => {
        const newIndex = currentReviewIndex > 0 ? currentReviewIndex - 1 : courseReviews.length - 1;
        scrollToReview(newIndex);
    };

    const goToNext = () => {
        const newIndex = currentReviewIndex < courseReviews.length - 1 ? currentReviewIndex + 1 : 0;
        scrollToReview(newIndex);
    };

    // Get tutor information
    const tutorName = course.tutor?.user?.name || course.tutor?.name || 'Unknown Instructor';
    
    // Get course chapters for "what you'll learn" section
    const chapters = course.chapters || [];

    const handlePreRegister = () => {
        const whatsappMessage = `Hello, I am interested in pre-registering for the course "${course.title}". Could you please provide me with more information?`;
        const whatsappUrl = `https://wa.me/96178795366?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    }

    return (
        <div className={style.courseInfoCard}>
            <div className={style.DetailsReviews}>
                <div className={`${style.courseDetails} ${!toggleReviews ? style.notExpanded : ''}`}>
                    <div className={style.CodeCredits}>
                        <h2 className={style.courseCode}>{course.code}</h2>
                        {course.credits && course.credits !== 0 && (
                            <p className={style.courseCredits}>Credits: {course.credits}</p>
                        )}
                    </div>

                    <div className={style.courseImageContainer}>
                        {course.image ? (
                            <img 
                                src={course.image} 
                                alt={course.title} 
                                className={style.courseImage} 
                            />
                        ) : (
                            <div className={style.placeholderImage}>No Image Available</div>
                        )}
                    </div>
                    
                    <h3 className={style.courseTitle}>{course.title}</h3>
                    
                    <div className={style.YouWillSee}>
                        <h4 className={style.youWillSeeTitle}>What You'll Learn</h4>
                        <ul
                            className={`${style.youWillSeeList} ${!showAllChapters ? style.clampedList : ''}`}
                        >
                            {chapters.length > 0 ? (
                                chapters.map((chapter, index) => (
                                    <li key={chapter.id || index} className={style.youWillSeeItem}>
                                        {chapter.content || chapter.title || chapter.name}
                                    </li>
                                ))
                            ) : course.description ? (
                                <li className={style.youWillSeeItem}>{course.description}</li>
                            ) : (
                                <li className={style.youWillSeeItem}>Course content details coming soon</li>
                            )}
                        </ul>
                        {!showAllChapters && chapters.length > 2 && (
                            <button
                                className={style.readMoreBtn}
                                onClick={() => setShowAllChapters(true)}
                                type="button"
                            >
                                Read more
                            </button>
                        )}
                        {showAllChapters && chapters.length > 2 && (
                            <button
                                className={style.readMoreBtn}
                                onClick={() => setShowAllChapters(false)}
                                type="button"
                            >
                                Show less
                            </button>
                        )}
                    </div>
                    
                    <div className={style.courseInfo}>
                        <div className={style.coursePrice}>
                            <div className={style.icon}>💰</div>
                            <div className={style.label}>Price</div>
                            <div className={style.value}>{course.price ? `$${course.price}` : 'Free'}</div>
                        </div>
                        
                        <div className={style.courseDuration}>
                            <div className={style.icon}>⏱️</div>
                            <div className={style.label}>Duration</div>
                            <div className={style.value}>
                                {course.duration_weeks ? `${course.duration_weeks} weeks` : 
                                 course.duration_hours ? `${course.duration_hours} hours` : 'Self-paced'}
                            </div>
                        </div>
                        
                        {course.semester && course.semester !== 0 && (
                            <div className={style.courseSem}>
                                <div className={style.icon}>📚</div>
                                <div className={style.label}>Semester</div>
                                <div className={style.value}>{course.semester}</div>
                            </div>
                        )}
                    </div>

                    <div className={style.TutorEnroll}>
                        <div className={style.tutorInfo}>
                            <span className={style.icon}>👨‍🏫</span>
                            <Link href={`/tutors/${course.tutor?.id}`} className={style.tutorName}>{tutorName}</Link>
                        </div>
                        <div className={style.courseActions}>
                            {specialCategory ? (
                                <button className={style.enrollButton} onClick={handlePreRegister}>Pre-Register</button>
                            ) : (
                                <button className={style.enrollButton} onClick={() => onAddToCart(course)}>
                                    <img src={cartIcon} alt="cart" />Add to Cart
                                </button>
                            )}
                            <button 
                                className={style.rateButton} 
                                onClick={() => setShowRatingModal(true)}
                            >
                                ⭐ Rate Course
                            </button>
                        </div>
                    </div>
                </div>

                <div className={style.reviewToggle}>
                    <button 
                        onClick={handleToggle}
                        className={`${style.reviewsToggleButton} ${toggleReviews ? style.active : style.slideBack}`}
                    >
                        {toggleReviews ? 'Hide Reviews ↑' : 'Show Reviews ↓'}
                    </button>

                    <div className={`${style.courseReviews} ${toggleReviews ? style.slideIn : style.slideOut}`}>
                        {toggleReviews && (
                            <div className={style.reviewCarousel}>
                                {reviewsLoading ? (
                                    <p className={style.loadingReviews}>Loading reviews...</p>
                                ) : courseReviews.length > 0 ? (
                                    <>
                                        <button 
                                            className={`${style.navArrow} ${style.prevArrow}`}
                                            onClick={goToPrevious}
                                            aria-label="Previous review"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>

                                        <div 
                                            ref={scrollRef}
                                            className={style.reviewsWrapper}
                                        >
                                            {courseReviews.map((review, index) => (
                                                <CourseReviewCard key={index} review={review} />
                                            ))}
                                        </div>

                                        <button 
                                            className={`${style.navArrow} ${style.nextArrow}`}
                                            onClick={goToNext}
                                            aria-label="Next review"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <p className={style.noReviews}>No reviews available for this course.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                type="course"
                subject={course}
                onRatingSubmitted={handleRatingSubmitted}
            />
        </div>
    );
}