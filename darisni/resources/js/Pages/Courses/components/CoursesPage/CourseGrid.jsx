import { CourseInfoCard } from "@/Pages/Courses/components/CourseInfo/CourseInfoCard";
import style from "../../Courses.module.css";

export function CourseGrid({
    filteredCourses,
    addToCart,
    specialCategory
}) {
    return (
        <div className={style.coursesGrid}>
            {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                    <CourseInfoCard
                        key={course.id}
                        course={course}
                        onAddToCart={addToCart}
                        specialCategory={specialCategory}
                    />
                ))
            ) : (
                <p className={style.noCourses}>
                    No courses found for this category.
                </p>
            )}
        </div>
    );
}