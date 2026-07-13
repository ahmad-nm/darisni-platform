import { useEffect, useState } from "react";

export function useCoursesData() {
    const [isLoading, setIsLoading] = useState(true);
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const minLoadTime = 1500;
        const start = Date.now();

        const fetchData = async () => {
            try {
                const [coursesResponse, categoriesResponse] = await Promise.all([
                    fetch("/api/courses"),
                    fetch("/api/categories")
                ]);

                const coursesData = await coursesResponse.json();
                const categoriesData = await categoriesResponse.json();

                if (coursesData.success) {
                    setAllCourses(coursesData.data);
                }

                if (categoriesData.success) {
                    setCategories(categoriesData.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setAllCourses([]);
                setCategories([]);
            }
        };

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = minLoadTime - elapsed;

            if (remaining > 0) {
                setTimeout(() => setIsLoading(false), remaining);
            } else {
                setIsLoading(false);
            }
        };

        fetchData();

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    return {
        isLoading,
        allCourses,
        categories
    };
}