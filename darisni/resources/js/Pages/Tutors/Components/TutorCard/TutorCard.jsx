import { router } from '@inertiajs/react';
import starImg from '@/assets/Icons/testStar.png';
import emptyStarImg from '@/assets/Icons/testStarEmpty.png';
import style from './TutorCard.module.css';

export function TutorCard({ tutor }) {
    const handleUserNavigate = () => {
        router.visit(`/tutors/${tutor.id}`);
    };

    // Get courses from the relationship or fallback to empty array
    const courses = Array.isArray(tutor.courses) && tutor.courses.length > 0 
        ? tutor.courses.map(course => course.title || course.name) 
        : [];
    
    // Use average_rating from the database
    const rating = Math.floor(
        tutor.average_rating && typeof tutor.average_rating === 'number' 
            ? tutor.average_rating 
            : 0
    );
    const maxStars = 5;

    return (
        <div className={style.TutorCardContainer}>
            <div className={style.TutorInfo}>
                <div className={style.TutorRating}>
                    {[...Array(rating)].map((_, index) => (
                        <p key={index} className={style.star}><img src={starImg} alt='star' /></p>
                    ))}
                    {[...Array(maxStars - rating)].map((_, index) => (
                        <p key={index} className={style.star}><img src={emptyStarImg} alt='empty star' /></p>
                    ))}
                </div>

                <h2 className={style.TutorName}>{tutor.name || tutor.user?.name || 'Unknown'}</h2>
                <p className={style.TutorMajor}>
                    {tutor.year ? `Year ${tutor.year}` : ''} 
                    {tutor.university ? ` at ${tutor.university}` : ''}
                </p>

                <div className={style.TutorCoursesButton}>
                    <div className={style.TutorCourses}>
                        <h3 className={style.TutorCoursesTitle}>Courses: </h3>
                        {courses.length > 0 ? (
                            courses.slice(0, 3).map((course, index) => (
                                <p key={index} className={style.TutorCourse}>{course}</p>
                            ))
                        ) : (
                            <p className={style.TutorCourse}>No courses listed</p>
                        )}
                        {courses.length > 3 && (
                            <p className={style.TutorCourse}>+{courses.length - 3} more</p>
                        )}
                    </div>
                    <button onClick={handleUserNavigate} className={style.TutorButton}>View Profile</button>
                </div>
            </div>

            <div className={style.TutorImage}>
                <img 
                    src={tutor.image || '/images/default-tutor.svg'} 
                    alt={tutor.name || tutor.user?.name || 'Tutor'} 
                />
            </div>
        </div>
    );
}