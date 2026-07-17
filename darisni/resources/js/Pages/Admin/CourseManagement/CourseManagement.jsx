import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import styles from "./CourseManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";

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

    // API functions using Inertia.js
    const createCourse = async (courseData) => {
        return new Promise((resolve, reject) => {
            router.post("/admin/courses", courseData, {
                onSuccess: () => {
                    // Just resolve - the redirect will happen automatically
                    resolve(courseData);
                },
                onError: (errors) => {
                    reject({ response: { status: 422, data: { errors } } });
                },
            });
        });
    };

    const updateCourse = async (courseId, courseData) => {
        return new Promise((resolve, reject) => {
            router.put(`/admin/courses/${courseId}`, courseData, {
                onSuccess: () => {
                    // Just resolve - the redirect will happen automatically
                    resolve({ ...courseData, id: courseId });
                },
                onError: (errors) => {
                    reject({ response: { status: 422, data: { errors } } });
                },
            });
        });
    };

    const deleteCourse = async (courseId) => {
        return new Promise((resolve, reject) => {
            router.delete(`/admin/courses/${courseId}`, {
                onSuccess: () => {
                    // Just resolve - the redirect will happen automatically
                    resolve();
                },
                onError: (errors) => {
                    reject({
                        response: {
                            data: { message: "Failed to delete course" },
                        },
                    });
                },
            });
        });
    };

    // Chapter API functions
    const getCourseChapters = async (courseId) => {
        try {
            const response = await fetch(
                `/admin/courses/${courseId}/chapters`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                },
            );
            const data = await response.json();
            return data.chapters || [];
        } catch (error) {
            console.error("Error fetching chapters:", error);
            return [];
        }
    };

    const createCourseChapter = async (chapterData) => {
        return new Promise((resolve, reject) => {
            router.post("/admin/chapters", chapterData, {
                onSuccess: (page) => {
                    // If your backend returns the new chapter, you can access it via page.props
                    resolve(page.props.chapter || chapterData);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    };

    const updateCourseChapter = async (chapterId, chapterData) => {
        return new Promise((resolve, reject) => {
            router.put(`/admin/chapters/${chapterId}`, chapterData, {
                onSuccess: (page) => {
                    resolve(page.props.chapter || chapterData);
                },
                onError: (errors) => {
                    reject(errors);
                },
            });
        });
    };

    const deleteCourseChapter = async (chapterId) => {
        return new Promise((resolve, reject) => {
            router.delete(`/admin/chapters/${chapterId}`, {
                onSuccess: () => resolve(),
                onError: (errors) => reject(errors),
            });
        });
    };

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

// Chapter Management Modal Component
function ChapterManagementModal({
    course,
    onClose,
    getCourseChapters,
    createCourseChapter,
    updateCourseChapter,
    deleteCourseChapter,
}) {
    const [chapters, setChapters] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState("");

    useEffect(() => {
        fetchChapters();
    }, [course.id]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const response = await getCourseChapters(course.id);
            setChapters(response || []);
        } catch (error) {
            console.error("Error fetching chapters:", error);
            setChapters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddChapter = () => {
        setEditingChapter(null);
        setChapterContent("");
        setShowChapterForm(true);
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setChapterContent(chapter.content);
        setShowChapterForm(true);
    };

    const handleSaveChapter = async (e) => {
        e.preventDefault();
        if (!chapterContent.trim()) return;

        try {
            if (editingChapter) {
                // Update existing chapter
                const updatedChapter = await updateCourseChapter(
                    editingChapter.id,
                    {
                        course_id: course.id,
                        content: chapterContent,
                    },
                );
                setChapters((prev) =>
                    prev.map((ch) =>
                        ch.id === editingChapter.id ? updatedChapter : ch,
                    ),
                );
            } else {
                // Create new chapter
                const newChapter = await createCourseChapter({
                    course_id: course.id,
                    content: chapterContent,
                });
                setChapters((prev) => [...prev, newChapter]);
            }

            setShowChapterForm(false);
            setChapterContent("");
            setEditingChapter(null);
        } catch (error) {
            console.error("Error saving chapter:", error);
            alert("Failed to save chapter. Please try again.");
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm("Are you sure you want to delete this chapter?"))
            return;

        try {
            await deleteCourseChapter(chapterId);
            setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
        } catch (error) {
            console.error("Error deleting chapter:", error);
            alert("Failed to delete chapter. Please try again.");
        }
    };

    const handleCancelForm = () => {
        setShowChapterForm(false);
        setChapterContent("");
        setEditingChapter(null);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.chapterModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2>Manage Chapters - {course.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.chapterModalContent}>
                    <div className={styles.chapterHeader}>
                        <h3>Course Chapters ({chapters.length})</h3>
                        <button
                            className={styles.addChapterBtn}
                            onClick={handleAddChapter}
                        >
                            + Add Chapter
                        </button>
                    </div>

                    {showChapterForm && (
                        <div className={styles.chapterForm}>
                            <h4>
                                {editingChapter
                                    ? "Edit Chapter"
                                    : "Add New Chapter"}
                            </h4>
                            <form onSubmit={handleSaveChapter}>
                                <div className={styles.formGroup}>
                                    <label>Chapter Content</label>
                                    <textarea
                                        value={chapterContent}
                                        onChange={(e) =>
                                            setChapterContent(e.target.value)
                                        }
                                        className={styles.chapterTextarea}
                                        placeholder="Enter chapter content, title, or description..."
                                        required
                                        rows={4}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button
                                        type="button"
                                        onClick={handleCancelForm}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.saveBtn}
                                    >
                                        {editingChapter
                                            ? "Update Chapter"
                                            : "Add Chapter"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={styles.chaptersList}>
                        {loading ? (
                            <div className={styles.loadingMessage}>
                                Loading chapters...
                            </div>
                        ) : chapters.length === 0 ? (
                            <div className={styles.noChapters}>
                                <p>No chapters found for this course.</p>
                                <p>
                                    Click "Add Chapter" to create the first
                                    chapter.
                                </p>
                            </div>
                        ) : (
                            Array.isArray(chapters) &&
                            chapters.map((chapter, index) => (
                                <div
                                    key={chapter.id}
                                    className={styles.chapterItem}
                                >
                                    <div className={styles.chapterNumber}>
                                        Chapter {index + 1}
                                    </div>
                                    <div className={styles.chapterContent}>
                                        <p>
                                            {chapter.content ||
                                                "No content available"}
                                        </p>
                                        <div className={styles.chapterMeta}>
                                            <span>
                                                Created:{" "}
                                                {chapter.created_at
                                                    ? new Date(
                                                          chapter.created_at,
                                                      ).toLocaleDateString()
                                                    : "Unknown"}
                                            </span>
                                            {chapter.updated_at &&
                                                chapter.updated_at !==
                                                    chapter.created_at && (
                                                    <span>
                                                        Updated:{" "}
                                                        {new Date(
                                                            chapter.updated_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className={styles.chapterActions}>
                                        <button
                                            onClick={() =>
                                                handleEditChapter(chapter)
                                            }
                                            className={styles.editChapterBtn}
                                            title="Edit Chapter"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteChapter(chapter.id)
                                            }
                                            className={styles.deleteChapterBtn}
                                            title="Delete Chapter"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Course Details/Edit Modal Component
function CourseModal({
    course,
    mode,
    categories,
    tutors,
    onClose,
    onSave,
    setModalMode,
}) {
    const [formData, setFormData] = useState({
        code: course?.code || "",
        title: course?.title || "",
        subject: course?.subject || "",
        category_id: course?.category_id || "",
        tutor_id: course?.tutor_id || "",
        price: course?.price || "",
        lectures: course?.lectures || "",
        credits: course?.credits || "",
        semester: course?.semester || "",
        duration_weeks: course?.duration_weeks || "",
        type: course?.type || "",
        image: course?.image || "",
        visible: course?.visible !== undefined ? course.visible : true,
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const response = await fetch("/admin/courses/upload-image", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formDataUpload,
            });
            const data = await response.json();
            if (data.url) {
                setFormData((prev) => ({ ...prev, image: data.url }));
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === "view") return;

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            alert("Failed to save course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getCategoryName = (categoryId) => {
        if (
            !categoryId ||
            !Array.isArray(categories) ||
            categories.length === 0
        )
            return "Unknown";
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Unknown";
    };

    const getTutorName = (tutorId) => {
        if (!tutorId || !Array.isArray(tutors) || tutors.length === 0)
            return "Unknown";
        const tutor = tutors.find((t) => t.id === tutorId);
        return tutor ? tutor.user?.name || tutor.name || "Unknown" : "Unknown";
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        {mode === "view"
                            ? "Course Details"
                            : mode === "edit"
                              ? "Edit Course"
                              : "Create New Course"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                {mode === "view" ? (
                    <div className={styles.courseDetailsView}>
                        <div className={styles.courseImageSection}>
                            {course.image ? (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className={styles.courseImageLarge}
                                />
                            ) : (
                                <div className={styles.placeholderImageLarge}>
                                    📚
                                </div>
                            )}
                        </div>

                        <div className={styles.courseInfoGrid}>
                            <div className={styles.infoItem}>
                                <label>Course Code</label>
                                <span>{course.code}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Title</label>
                                <span>{course.title}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Category</label>
                                <span>
                                    {getCategoryName(course.category_id)}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Tutor</label>
                                <span>{getTutorName(course.tutor_id)}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Subject</label>
                                <span>{course.subject || "Not specified"}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Price</label>
                                <span>
                                    {course.price ? `$${course.price}` : "Free"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Lectures</label>
                                <span>
                                    {course.lectures || "Not specified"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Credits</label>
                                <span>{course.credits || "Not specified"}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Semester</label>
                                <span>
                                    {course.semester || "Not specified"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Duration</label>
                                <span>
                                    {course.duration_weeks
                                        ? `${course.duration_weeks} weeks`
                                        : "Self-paced"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Type</label>
                                <span>{course.type || "Not specified"}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Created</label>
                                <span>
                                    {new Date(
                                        course.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                onClick={onClose}
                                className={styles.cancelBtn}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setModalMode("edit")}
                                className={styles.editFromViewBtn}
                            >
                                Edit Course
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Course Code *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            code: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Category *</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category_id: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                    required
                                >
                                    <option value="">Select Category</option>
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

                            <div className={styles.formGroup}>
                                <label>Tutor *</label>
                                <select
                                    value={formData.tutor_id}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            tutor_id: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                    required
                                >
                                    <option value="">Select Tutor</option>
                                    {tutors.map((tutor) => (
                                        <option key={tutor.id} value={tutor.id}>
                                            {tutor.user
                                                ? tutor.user.name
                                                : tutor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            subject: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            price: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Lectures</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.lectures}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            lectures: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Credits</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.credits}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            credits: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Semester</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={formData.semester}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            semester: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Duration (weeks)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.duration_weeks}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            duration_weeks: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Type</label>
                                <input
                                    type="text"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            type: e.target.value,
                                        }))
                                    }
                                    className={styles.modalInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Course Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className={styles.modalInput}
                                    disabled={uploading}
                                />
                                {uploading && <span>Uploading...</span>}
                                {formData.image && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <img
                                            src={formData.image}
                                            alt="Course"
                                            style={{
                                                maxWidth: 80,
                                                marginTop: 8,
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className={styles.removeImageBtn}
                                            style={{
                                                marginLeft: 8,
                                                background: "#f44336",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 4,
                                                padding: "4px 8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.visible}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                visible: e.target.checked,
                                            }))
                                        }
                                        className={styles.modalCheckbox}
                                    />
                                    Visible
                                </label>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancelBtn}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={styles.saveBtn}
                            >
                                {loading
                                    ? "Saving..."
                                    : mode === "create"
                                      ? "Create Course"
                                      : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ course, onConfirm, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div
                className={styles.deleteModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteModalHeader}>
                    <h2>Confirm Delete</h2>
                </div>

                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this course?</p>
                    <div className={styles.coursePreview}>
                        <strong>{course.title}</strong>
                        <br />
                        <span>Code: {course.code}</span>
                        <br />
                        <span>
                            Price: {course.price ? `$${course.price}` : "Free"}
                        </span>
                    </div>
                    <p className={styles.warning}>
                        This action cannot be undone.
                    </p>
                </div>

                <div className={styles.deleteModalActions}>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={styles.deleteConfirmBtn}
                    >
                        {loading ? "Deleting..." : "Delete Course"}
                    </button>
                </div>
            </div>
        </div>
    );
}
