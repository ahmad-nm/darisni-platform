import { useState, useRef } from "react";
import { RatingModal } from "../../../../Components/RatingModal/RatingModal.jsx";
import style from "./CourseInfoCard.module.css";
import { CourseDetails } from "./components/CourseDetails.jsx";
import { CourseReviews } from "./components/CourseReviews.jsx";

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
                const response = await fetch(
                    `/api/reviews/course/${course.id}`,
                );
                const data = await response.json();
                if (data.success) {
                    setCourseReviews(data.data.reviews || []);
                }
            } catch (error) {
                console.error("Error fetching course reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        }
        setToggleReviews(!toggleReviews);
    };

    const handleRatingSubmitted = () => {
        console.log("Course rating submitted successfully!");
    };

    const scrollToReview = (index) => {
        if (scrollRef.current && courseReviews.length > 0) {
            const reviewWidth = 400;
            const scrollPosition = index * reviewWidth;
            scrollRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth",
            });
            setCurrentReviewIndex(index);
        }
    };

    const goToPrevious = () => {
        const newIndex =
            currentReviewIndex > 0
                ? currentReviewIndex - 1
                : courseReviews.length - 1;
        scrollToReview(newIndex);
    };

    const goToNext = () => {
        const newIndex =
            currentReviewIndex < courseReviews.length - 1
                ? currentReviewIndex + 1
                : 0;
        scrollToReview(newIndex);
    };

    // Get tutor information
    const tutorName =
        course.tutor?.user?.name || course.tutor?.name || "Unknown Instructor";

    // Get course chapters for "what you'll learn" section
    const chapters = course.chapters || [];

    const handlePreRegister = () => {
        const whatsappMessage = `Hello, I am interested in pre-registering for the course "${course.title}". Could you please provide me with more information?`;
        const whatsappUrl = `https://wa.me/96178795366?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div className={style.courseInfoCard}>
            <div className={style.DetailsReviews}>
                <CourseDetails
                    course={course}
                    toggleReviews={toggleReviews}
                    showAllChapters={showAllChapters}
                    setShowAllChapters={setShowAllChapters}
                    tutorName={tutorName}
                    chapters={chapters}
                    specialCategory={specialCategory}
                    onAddToCart={onAddToCart}
                    handlePreRegister={handlePreRegister}
                    setShowRatingModal={setShowRatingModal}
                />
                <CourseReviews
                    toggleReviews={toggleReviews}
                    handleToggle={handleToggle}
                    reviewsLoading={reviewsLoading}
                    courseReviews={courseReviews}
                    goToPrevious={goToPrevious}
                    goToNext={goToNext}
                    scrollRef={scrollRef}
                />
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
