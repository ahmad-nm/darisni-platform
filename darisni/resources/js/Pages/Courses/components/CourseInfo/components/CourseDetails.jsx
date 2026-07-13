import cartIcon from "../../../../../assets/Icons/cart.png";
import { Link } from "@inertiajs/react";
import style from "../CourseInfoCard.module.css";

export function CourseDetails({
    course,
    toggleReviews,
    showAllChapters,
    setShowAllChapters,
    tutorName,
    chapters,
    specialCategory,
    onAddToCart,
    handlePreRegister,
    setShowRatingModal,
}) {
    return (
        <div
            className={`${style.courseDetails} ${!toggleReviews ? style.notExpanded : ""}`}
        >
            <div className={style.CodeCredits}>
                <h2 className={style.courseCode}>{course.code}</h2>
                {course.credits && course.credits !== 0 && (
                    <p className={style.courseCredits}>
                        Credits: {course.credits}
                    </p>
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
                    <div className={style.placeholderImage}>
                        No Image Available
                    </div>
                )}
            </div>

            <h3 className={style.courseTitle}>{course.title}</h3>

            <div className={style.YouWillSee}>
                <h4 className={style.youWillSeeTitle}>What You'll Learn</h4>
                <ul
                    className={`${style.youWillSeeList} ${!showAllChapters ? style.clampedList : ""}`}
                >
                    {chapters.length > 0 ? (
                        chapters.map((chapter, index) => (
                            <li
                                key={chapter.id || index}
                                className={style.youWillSeeItem}
                            >
                                {chapter.content ||
                                    chapter.title ||
                                    chapter.name}
                            </li>
                        ))
                    ) : course.description ? (
                        <li className={style.youWillSeeItem}>
                            {course.description}
                        </li>
                    ) : (
                        <li className={style.youWillSeeItem}>
                            Course content details coming soon
                        </li>
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
                    <div className={style.value}>
                        {course.price ? `$${course.price}` : "Free"}
                    </div>
                </div>

                <div className={style.courseDuration}>
                    <div className={style.icon}>⏱️</div>
                    <div className={style.label}>Duration</div>
                    <div className={style.value}>
                        {course.duration_weeks
                            ? `${course.duration_weeks} weeks`
                            : course.duration_hours
                              ? `${course.duration_hours} hours`
                              : "Self-paced"}
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
                    <Link
                        href={`/tutors/${course.tutor?.id}`}
                        className={style.tutorName}
                    >
                        {tutorName}
                    </Link>
                </div>
                <div className={style.courseActions}>
                    {specialCategory ? (
                        <button
                            className={style.enrollButton}
                            onClick={handlePreRegister}
                        >
                            Pre-Register
                        </button>
                    ) : (
                        <button
                            className={style.enrollButton}
                            onClick={() => onAddToCart(course)}
                        >
                            <img src={cartIcon} alt="cart" />
                            Add to Cart
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
    );
}
