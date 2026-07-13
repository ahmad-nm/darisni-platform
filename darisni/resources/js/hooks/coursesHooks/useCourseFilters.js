import { useState, useEffect, useCallback } from "react";

const SPECIAL_CATEGORIES = [
    "Pre Registered",
    "Pre-Registered",
    "preregistered"
];

export function useCourseFilters(allCourses, categories, categoryId) {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    const [subjectFilter, setSubjectFilter] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");

    const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);

    const [dynamicSubjectOptions, setDynamicSubjectOptions] = useState([
        { value: "", label: "All Subjects" }
    ]);

    const [dynamicSemesterOptions, setDynamicSemesterOptions] = useState([
        { value: "", label: "All Semesters" }
    ]);

    function isSpecialCategory(name) {
        if (!name) return false;

        return SPECIAL_CATEGORIES.some(
            special =>
                name.trim().toLowerCase() ===
                special.trim().toLowerCase()
        );
    }

    function getUniqueSubjects(courses) {
        const subjects = courses
            .map(course => course.subject)
            .filter(Boolean);

        return [...new Set(subjects)];
    }

    function getUniqueSemesters(courses) {
        const semesters = courses
            .map(course => Number(course.semester))
            .filter(
                sem => sem && sem !== 0 && !isNaN(sem)
            );

        return [...new Set(semesters)].sort((a, b) => a - b);
    }

    const applyFilters = useCallback(
        (coursesToFilter, subject, semester) => {
            let filtered = coursesToFilter;

            if (subject) {
                filtered = filtered.filter(course => {
                    const courseSubject =
                        course.subject?.toLowerCase() || "";

                    const filterSubject =
                        subject.toLowerCase();

                    return (
                        courseSubject.includes(filterSubject) ||
                        filterSubject.includes(courseSubject)
                    );
                });
            }

            if (semester) {
                filtered = filtered.filter(
                    course =>
                        course.semester?.toString() === semester
                );
            }

            setFilteredCourses(filtered);
        },
        []
    );

    useEffect(() => {
        const coursesForCategory = allCourses.filter(
            course =>
                Number(course.category_id) ===
                Number(categoryId)
        );

        const uniqueSubjects =
            getUniqueSubjects(coursesForCategory);

        setDynamicSubjectOptions([
            { value: "", label: "All Subjects" },
            ...uniqueSubjects.map(subject => ({
                value: subject,
                label: subject
            }))
        ]);

        const uniqueSemesters =
            getUniqueSemesters(coursesForCategory);

        setDynamicSemesterOptions([
            { value: "", label: "All Semesters" },
            ...uniqueSemesters.map(sem => ({
                value: String(sem),
                label: `Semester ${sem}`
            }))
        ]);

        applyFilters(
            coursesForCategory,
            subjectFilter,
            semesterFilter
        );

        const category = categories.find(
            cat => Number(cat.id) === Number(categoryId)
        );

        setCategoryName(
            category ? category.name : "Unknown Category"
        );
    }, [
        allCourses,
        categories,
        categoryId,
        subjectFilter,
        semesterFilter,
        applyFilters
    ]);

    const handleFilter = event => {
        const { id, value } = event.target;

        if (id === "subjectFilter") {
            setSubjectFilter(value);
        } else if (id === "semesterFilter") {
            setSemesterFilter(value);
        }
    };

    return {
        filteredCourses,
        categoryName,
        specialCategory: isSpecialCategory(categoryName),

        subjectFilter,
        semesterFilter,

        dynamicSubjectOptions,
        dynamicSemesterOptions,

        handleFilter,

        subjectDropdownOpen,
        setSubjectDropdownOpen
    };
}