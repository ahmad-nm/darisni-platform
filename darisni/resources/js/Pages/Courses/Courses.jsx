import { Loader } from "../../Components/Loader/Loader.jsx";
import { Navbar } from "../../Components/navBar/nav.jsx";
import { About } from "../AboutPage/components/About/About.jsx";
import style from "./Courses.module.css";

import { useCart } from "../../hooks/coursesHooks/useCart.js";
import { useCoursesData } from "../../hooks/coursesHooks/useCoursesData.js";
import { useCourseFilters } from "../../hooks/coursesHooks/useCourseFilters.js";
import { CourseGrid } from "./components/CoursesPage/CourseGrid.jsx";
import { CartSidebar } from "./components/CoursesPage/CartSidebar.jsx";
import { CourseFilters } from "./components/CoursesPage/CourseFilters.jsx";

export default function Courses({ CategoryId: categoryId }) {
    const { cartItems, setCartItems, addToCart, removeFromCart } = useCart();

    const { isLoading, allCourses, categories } = useCoursesData();

    const {
        filteredCourses,
        categoryName,
        specialCategory,

        subjectFilter,
        semesterFilter,

        dynamicSubjectOptions,
        dynamicSemesterOptions,

        handleFilter,

        subjectDropdownOpen,
        setSubjectDropdownOpen,
    } = useCourseFilters(allCourses, categories, categoryId);

    return (
        <div className={style.coursesContainer}>
            {isLoading ? (
                <div className={style.loaderWrapper}>
                    <Loader />
                </div>
            ) : (
                <>
                    <Navbar />
                    <h1 className={style.pageTitle}>{categoryName} Courses</h1>

                    <CartSidebar
                        cartItems={cartItems}
                        removeFromCart={removeFromCart}
                        setCartItems={setCartItems}
                        specialCategory={specialCategory}
                    />
                    <CourseFilters
                        subjectFilter={subjectFilter}
                        semesterFilter={semesterFilter}
                        dynamicSubjectOptions={dynamicSubjectOptions}
                        dynamicSemesterOptions={dynamicSemesterOptions}
                        handleFilter={handleFilter}
                        subjectDropdownOpen={subjectDropdownOpen}
                        setSubjectDropdownOpen={setSubjectDropdownOpen}
                    />
                    <CourseGrid
                        filteredCourses={filteredCourses}
                        addToCart={addToCart}
                        specialCategory={specialCategory}
                    />

                    <div className={style.aboutSection}>
                        <About />
                    </div>
                </>
            )}
        </div>
    );
}
