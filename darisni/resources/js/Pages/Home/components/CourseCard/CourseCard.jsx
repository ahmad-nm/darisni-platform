import style from './CourseCard.module.css';
import clockImage from '../../../../assets/Icons/clock.png';
import lectureImage from '../../../../assets/Icons/openBook.png';
import ratingImage from '../../../../assets/Icons/star.png';
import { ROUTES } from '@/constants/routes';

export function CourseCard({ course }) {
    return (
        <div className={style.CourseCard}>
            <div className={style.ImageContainer}>
                <img 
                    src={course.image || '/images/default-course.svg'} 
                    alt={course.title} 
                    className={style.CourseImage} 
                />
            </div>
    
            <div className={style.CourseDetails}>
                <h3 className={style.CourseTitle}>{course.title}</h3>
                
                <div className={style.CourseInfo}>
                    <div className={style.Time}>
                        <img src={clockImage} alt="Clock" className={style.Icon} />
                        <p>{course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced'}</p>
                    </div>
                    
                    <div className={style.Lectures}>
                        <img src={lectureImage} alt="Lecture" className={style.Icon} />
                        <p>{course.lectures || 0} {(course.lectures || 0) > 1 ? 'Lectures' : 'Lecture'}</p>
                    </div>

                    <div className={style.Rating}>
                        <img src={ratingImage} alt="Rating" className={style.Icon} />
                        <p>
                            {course.average_rating && typeof course.average_rating === 'number' 
                                ? course.average_rating.toFixed(1) 
                                : '0.0'}
                        </p>
                    </div>
                </div>

                <div className={style.ViewPrice}>
                    <a href={ROUTES.COURSE_DETAIL(course.id)} className={style.ViewButton}>View</a>
                    <p className={style.CoursePrice}>{course.price ? `$${course.price}` : 'Free'}</p>
                </div>
            </div>
        </div>
    )
}