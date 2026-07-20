import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import styles from "./CourseManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import {createCourse, updateCourse, deleteCourse} from "@/services/admin/courseService";
import {getCourseChapters, createCourseChapter, updateCourseChapter, deleteCourseChapter} from "@/services/admin/courseChapterService";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import CourseModal from "./components/CourseModal/CourseModal";
import ChapterManagementModal from "./components/CourseManagementModal";

export default function CourseManagement({
    courses: initialCourses,
    categories: initialCategories,
    tutors: initialTutors,
    stats: initialStats,
}) {
    const [courses, setCourses] = useState(initialCourses || []);
    const [categories, setCategories] = useState(initialCategories || []);
    const [tutors, setTutors] = useState(initialTutors || []);
    const [filteredCourses, setFilteredCourses] = useState(
        initialCourses || [],
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedVisibility, setSelectedVisibility] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'
    const [stats, setStats] = useState(initialStats || {});
    const coursesPerPage = 12;

    // Update data when props change
    useEffect(() => {
        if (initialCourses && initialCourses.length >= 0) {
            setCourses(initialCourses);
            setFilteredCourses(initialCourses);
        }
        if (initialCategories) setCategories(initialCategories);
        if (initialTutors) setTutors(initialTutors);
        if (initialStats) setStats(initialStats);
    }, [initialCourses, initialCategories, initialTutors, initialStats]);

    // Filter courses based on search and category
    useEffect(() => {
        let filtered = courses;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (course) =>
                    course.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    course.code
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (course.subject &&
                        course.subject
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())),
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (course) => course.category_id === parseInt(selectedCategory),
            );
        }

        if (selectedVisibility === "visible") {
            filtered = filtered.filter((course) => course.visible === true);
        } else if (selectedVisibility === "hidden") {
            filtered = filtered.filter((course) => course.visible === false);
        }

        setFilteredCourses(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, selectedCategory, selectedVisibility, courses]);

    // Pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(
        indexOfFirstCourse,
        indexOfLastCourse,
    );
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleDeleteCourse = async (courseId) => {
        setSelectedCourse(courses.find((course) => course.id === courseId));
        setShowDeleteModal(true);
    };

    const confirmDeleteCourse = async () => {
        if (!selectedCourse) return;

        try {
            await deleteCourse(selectedCourse.id);

            // Close modal - Inertia will handle the redirect and page refresh
            setShowDeleteModal(false);
            setSelectedCourse(null);
            // Note: No need to update local state since Inertia will refresh the page
        } catch (error) {
            console.error("Error deleting course:", error);
            alert("Failed to delete course. Please try again.");
        }
    };

    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setModalMode("view");
        setShowCourseModal(true);
    };

    const handleEditCourse = (course) => {
        setSelectedCourse(course);
        setModalMode("edit");
        setShowCourseModal(true);
    };

    const handleManageChapters = (course) => {
        setSelectedCourse(course);
        setShowChapterModal(true);
    };

    const handleCreateCourse = () => {
        setSelectedCourse(null);
        setModalMode("create");
        setShowCourseModal(true);
    };

    const handleSaveCourse = async (courseData) => {
        try {
            if (modalMode === "create") {
                await createCourse(courseData);
            } else {
                await updateCourse(selectedCourse.id, courseData);
            }

            // Close modal - Inertia will handle the redirect and page refresh
            setShowCourseModal(false);
            setSelectedCourse(null);
            // Note: No need to update local state since Inertia will refresh the page
        } catch (error) {
            console.error("Error saving course:", error);

            // Handle validation errors
            if (
                error.response?.status === 422 &&
                error.response?.data?.errors
            ) {
                const validationErrors = error.response.data.errors;
                let errorMessage = "Validation failed:\n";

                for (const [field, messages] of Object.entries(
                    validationErrors,
                )) {
                    errorMessage += `• ${field}: ${messages.join(", ")}\n`;
                }

                alert(errorMessage);
            } else if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to save course. Please try again.");
            }

            throw error;
        }
    };

    const getCategoryName = (categoryId) => {
        if (
            !categoryId ||
            !Array.isArray(categories) ||
            categories.length === 0
        )
            return "Unknown";
        const category = categories.find(
            (cat) => Number(cat.id) === Number(categoryId),
        );
        return category ? category.name : "Unknown";
    };

    const getTutorName = (tutorId) => {
        if (!tutorId || !Array.isArray(tutors) || tutors.length === 0)
            return "Unknown";
        const tutor = tutors.find((t) => Number(t.id) === Number(tutorId));
        return tutor ? tutor.user?.name || tutor.name || "Unknown" : "Unknown";
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading courses...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Course Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>
                                    Course Management
                                </h1>
                                <p className={styles.subtitle}>
                                    Manage all courses on your platform
                                </p>
                            </div>
                            <button
                                className={styles.addCourseButton}
                                onClick={handleCreateCourse}
                            >
                                + Add New Course
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search courses by title, code, or subject..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>

                        <div className={styles.filterContainer}>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className={styles.categoryFilter}
                            >
                                <option value="all">All Categories</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterContainer}>
                            <select
                                value={selectedVisibility}
                                onChange={(e) =>
                                    setSelectedVisibility(e.target.value)
                                }
                                className={styles.visibilityFilter}
                            >
                                <option value="all">All Visibility</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Not Visible</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredCourses.length}
                            </span>
                            <span className={styles.statLabel}>
                                Total Courses
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {categories.length}
                            </span>
                            <span className={styles.statLabel}>Categories</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {tutors.length}
                            </span>
                            <span className={styles.statLabel}>Tutors</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {
                                    filteredCourses.filter(
                                        (c) =>
                                            c.price === 0 || c.price === null,
                                    ).length
                                }
                            </span>
                            <span className={styles.statLabel}>
                                Free Courses
                            </span>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className={styles.coursesGrid}>
                        {currentCourses.map((course) => (
                            <div
                                key={course.id}
                                className={`${styles.courseCard} ${!course.visible ? styles.nonVisible : ""}`}
                            >
                                <div className={styles.courseHeader}>
                                    {!course.visible && (
                                        <div className={styles.nonVisibleBadge}>
                                            Not Visible
                                        </div>
                                    )}
                                    <div className={styles.courseCode}>
                                        {course.code}
                                    </div>
                                    <div className={styles.courseActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleViewCourse(course)
                                            }
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleEditCourse(course)
                                            }
                                            title="Edit Course"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleManageChapters(course)
                                            }
                                            title="Manage Chapters"
                                        >
                                            📖
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleDeleteCourse(course.id)
                                            }
                                            title="Delete Course"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.courseImage}>
                                    {course.image ? (
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                        />
                                    ) : (
                                        <div
                                            className={styles.placeholderImage}
                                        >
                                            📚
                                        </div>
                                    )}
                                </div>

                                <div className={styles.courseContent}>
                                    <h3 className={styles.courseTitle}>
                                        {course.title}
                                    </h3>
                                    <p className={styles.courseCategory}>
                                        {getCategoryName(course.category_id)}
                                    </p>
                                    <p className={styles.courseTutor}>
                                        👨‍🏫 {getTutorName(course.tutor_id)}
                                    </p>

                                    <div className={styles.courseDetails}>
                                        {course.subject && (
                                            <span
                                                className={styles.courseDetail}
                                            >
                                                📖 {course.subject}
                                            </span>
                                        )}
                                        {course.semester && (
                                            <span
                                                className={styles.courseDetail}
                                            >
                                                📅 Sem {course.semester}
                                            </span>
                                        )}
                                        {course.lectures && (
                                            <span
                                                className={styles.courseDetail}
                                            >
                                                🎥 {course.lectures} lectures
                                            </span>
                                        )}
                                    </div>

                                    <div className={styles.courseFooter}>
                                        <div className={styles.coursePrice}>
                                            {course.price
                                                ? `$${course.price}`
                                                : "Free"}
                                        </div>
                                        <div className={styles.courseDuration}>
                                            {course.duration_weeks
                                                ? `${course.duration_weeks} weeks`
                                                : "Self-paced"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <div className={styles.pageNumbers}>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.active : ""}`}
                                        onClick={() =>
                                            setCurrentPage(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className={styles.pageBtn}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {filteredCourses.length === 0 && (
                        <div className={styles.noResults}>
                            <p>
                                No courses found matching your search criteria.
                            </p>
                        </div>
                    )}
                </div>

                {/* Course Details/Edit Modal */}
                {showCourseModal && (
                    <CourseModal
                        course={selectedCourse}
                        mode={modalMode}
                        categories={categories}
                        tutors={tutors}
                        onClose={() => {
                            setShowCourseModal(false);
                            setSelectedCourse(null);
                            setModalMode("view");
                        }}
                        onSave={handleSaveCourse}
                        setModalMode={setModalMode}
                    />
                )}

                {/* Chapter Management Modal */}
                {showChapterModal && selectedCourse && (
                    <ChapterManagementModal
                        course={selectedCourse}
                        onClose={() => {
                            setShowChapterModal(false);
                            setSelectedCourse(null);
                        }}
                        getCourseChapters={getCourseChapters}
                        createCourseChapter={createCourseChapter}
                        updateCourseChapter={updateCourseChapter}
                        deleteCourseChapter={deleteCourseChapter}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedCourse && (
                    <DeleteConfirmationModal
                        course={selectedCourse}
                        onConfirm={confirmDeleteCourse}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedCourse(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}