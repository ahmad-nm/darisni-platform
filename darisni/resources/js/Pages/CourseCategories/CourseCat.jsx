import { useEffect, useState } from 'react';
import { Loader } from '../../Components/Loader/Loader.jsx';
import { Navbar } from '../../Components/navBar/nav.jsx';
import { CCHeader } from '../Courses/components/CourseCatHeader/CCHeader.jsx';
import { CategoryCardList } from './components/CategoryCard/CategoryCardList.jsx';
import { About } from '../AboutPage/components/About/About.jsx';
import style from './CourseCat.module.css';

export default function CourseCategories() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const minLoadTime = 1500; 
        const start = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = minLoadTime - elapsed;
            if (remaining > 0) {
                setTimeout(() => setIsLoading(false), remaining);
            } else {
                setIsLoading(false);
            }
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    return (
        <div className={style.CourseCatContainer}>
            {isLoading ? (<div className={style.loaderWrapper}>
                <Loader />
            </div>)
            :
            <>
                <header className={style.CourseCatHeader}>
                    <Navbar />
                    <CCHeader />
                </header>
                <div className={style.CourseCatContent}>
                    <CategoryCardList />
                </div>
                <footer className={style.CourseCatFooter}>
                    <About />
                </footer>
            </>}
        </div>
    )
}