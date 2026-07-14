import { useState, useEffect } from 'react';
import { CourseCard } from './CourseCard.jsx';
import { fetchCourses } from '../../../../services/courseCradService.js';
import style from './CourseCardList.module.css';

export function CourseCardList() {
    const [isMobileScreen, setIsMobileScreen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const courses = await fetchCourses();
                setCourses(courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    useEffect(() => {
        // Set initial screen size
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        if (window.innerWidth <= 480) {
            setIsMobileScreen(true);
        } else {
            setIsMobileScreen(false);
        }
    };

    const highlyRated = courses.filter(course => {
        const rating = course.average_rating || 0;
        return typeof rating === 'number' && rating > 4.7;
    });

    const count = isMobileScreen ? 2 : 4;

    // If there are highly rated courses, use them; otherwise, pick random courses
    const displayedCourses = (highlyRated.length > 0
        ? highlyRated
        : courses
    )
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

    if (loading) {
        return (
            <div className={style.CourseCardContainer}>
                <h2 className={style.header}>Top Courses</h2>
                <div className={style.loadingContainer}>
                    <p className={style.loadingText}>Loading courses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.CourseCardContainer}>
            <h2 className={style.header}>Top Courses</h2>
            <div className={style.CoursesList}>
                {displayedCourses.length > 0 ? (
                    displayedCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <p>No courses available.</p>
                )}
            </div>
        </div>
    );
}