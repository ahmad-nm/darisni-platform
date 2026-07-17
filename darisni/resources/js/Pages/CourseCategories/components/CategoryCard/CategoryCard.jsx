import { ROUTES } from '@/constants/routes';
import style from './CategoryCard.module.css';
import { Link } from '@inertiajs/react';

export function CategoryCard({ Category }) {
    return (
        <div className={style.categoryCard}>
            <div className={style.categoryImageContainer}>
                <img 
                    src={Category.image || '/images/default-category.svg'} 
                    alt={Category.name} 
                    className={style.categoryImage} 
                />
            </div>
            
            <div className={style.categoryDetails}>
                <h3 className={style.categoryName}>{Category.name}</h3>
                <p className={style.categoryDescription}>
                    {Category.description || 'Explore courses in this category'}
                </p>
                <Link href={ROUTES.COURSE_DETAIL(Category.id)} className={style.viewCoursesButton}>
                    View Courses →
                </Link>
            </div>
        </div>
    )
}