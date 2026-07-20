import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "./TutorManagement.module.css";
import { navigate } from "@/utils/navigationService";
import { ROUTES } from "@/constants/routes";
import {createTutor, updateTutor, deleteTutor, updateUserRole, createTutorAvailability, createTutorCourse, updateTutorCourse, deleteTutorCourse} from "@/services/admin/tutorService";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal/DeleteConfirmationModal";
import TutorModal from "./components/TutorModal/TutorModal";

export default function TutorManagement({
    tutors: initialTutors,
    users: initialUsers,
    courses: initialCourses,
    stats: initialStats,
}) {
    const [tutors, setTutors] = useState((initialTutors || []).filter(Boolean));
    const [filteredTutors, setFilteredTutors] = useState(
        (initialTutors || []).filter(Boolean),
    );
    const [users, setUsers] = useState(initialUsers || []);
    const [courses, setCourses] = useState(initialCourses || []);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showTutorModal, setShowTutorModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'
    const [stats, setStats] = useState(initialStats || {});
    const tutorsPerPage = 12;

    // Update data when props change
    useEffect(() => {
        if (initialTutors && initialTutors.length >= 0) {
            setTutors(initialTutors);
            setFilteredTutors(initialTutors);
        }
        if (initialUsers) setUsers(initialUsers);
        if (initialCourses) setCourses(initialCourses);
        if (initialStats) setStats(initialStats);
    }, [initialTutors, initialUsers, initialCourses, initialStats]);

    // Filter tutors based on search and status
    useEffect(() => {
        let filtered = tutors.filter(Boolean); // Remove any null/undefined values

        if (searchQuery) {
            filtered = filtered.filter(
                (tutor) =>
                    tutor &&
                    (tutor.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        tutor.user?.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        tutor.university
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                        tutor.bio
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase())),
            );
        }

        if (filterStatus !== "all") {
            switch (filterStatus) {
                case "active":
                    filtered = filtered.filter(
                        (tutor) =>
                            tutor && tutor.courses && tutor.courses.length > 0,
                    );
                    break;
                case "inactive":
                    filtered = filtered.filter(
                        (tutor) =>
                            tutor &&
                            (!tutor.courses || tutor.courses.length === 0),
                    );
                    break;
                case "experienced":
                    filtered = filtered.filter(
                        (tutor) => tutor && tutor.experience_years >= 2,
                    );
                    break;
                case "new":
                    filtered = filtered.filter(
                        (tutor) => tutor && tutor.experience_years < 2,
                    );
                    break;
                default:
                    break;
            }
        }

        setFilteredTutors(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, filterStatus, tutors]);

    // Pagination
    const indexOfLastTutor = currentPage * tutorsPerPage;
    const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
    const currentTutors = filteredTutors.slice(
        indexOfFirstTutor,
        indexOfLastTutor,
    );
    const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleDeleteTutor = async (tutorId) => {
        setSelectedTutor(tutors.find((tutor) => tutor.id === tutorId));
        setShowDeleteModal(true);
    };

    const confirmDeleteTutor = async () => {
        if (!selectedTutor) return;

        try {
            // Prevent changing your own admin role (already handled)
            if (
                window.Laravel &&
                window.Laravel.user &&
                window.Laravel.user.id === selectedTutor.user.id &&
                window.Laravel.user.role === "admin"
            ) {
                alert("You cannot change your own role from admin.");
                return;
            }

            // Delete tutor record
            await deleteTutor(selectedTutor.id);

            // Remove tutor from local state
            const updatedTutors = tutors.filter(
                (tutor) => tutor.id !== selectedTutor.id,
            );
            setTutors(updatedTutors);

            // Apply current filters to updated tutors
            applyFilters(updatedTutors);

            setShowDeleteModal(false);
            setSelectedTutor(null);
        } catch (error) {
            console.error("Error deleting tutor:", error);
            alert("Failed to delete tutor. Please try again.");
        }
    };

    const applyFilters = (tutorsList) => {
        let filtered = tutorsList;

        if (searchQuery) {
            filtered = filtered.filter(
                (tutor) =>
                    tutor.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tutor.user?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tutor.university
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    tutor.bio
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );
        }

        if (filterStatus !== "all") {
            switch (filterStatus) {
                case "active":
                    filtered = filtered.filter(
                        (tutor) => tutor.courses && tutor.courses.length > 0,
                    );
                    break;
                case "inactive":
                    filtered = filtered.filter(
                        (tutor) => !tutor.courses || tutor.courses.length === 0,
                    );
                    break;
                case "experienced":
                    filtered = filtered.filter(
                        (tutor) => tutor.experience_years >= 2,
                    );
                    break;
                case "new":
                    filtered = filtered.filter(
                        (tutor) => tutor.experience_years < 2,
                    );
                    break;
                default:
                    break;
            }
        }

        setFilteredTutors(filtered);
    };

    const handleViewTutor = (tutor) => {
        setSelectedTutor(tutor);
        setModalMode("view");
        setShowTutorModal(true);
    };

    const handleEditTutor = (tutor) => {
        setSelectedTutor(tutor);
        setModalMode("edit");
        setShowTutorModal(true);
    };

    const handleCreateTutor = () => {
        setSelectedTutor(null);
        setModalMode("create");
        setShowTutorModal(true);
    };

    const handleSaveTutor = async (tutorData) => {
        try {
            let savedTutor;
            const { availability, courses, ...basicTutorData } = tutorData;

            if (modalMode === "create") {
                // Create the tutor first
                savedTutor = await createTutor(basicTutorData);

                // Save availability if provided
                if (availability && availability.length > 0) {
                    for (const slot of availability) {
                        if (slot.day && slot.start_time && slot.end_time) {
                            try {
                                await createTutorAvailability({
                                    tutor_id: savedTutor.id,
                                    day: slot.day,
                                    start_time: slot.start_time,
                                    end_time: slot.end_time,
                                });
                            } catch (error) {
                                console.error(
                                    "Error saving availability slot:",
                                    error,
                                );
                            }
                        }
                    }
                }

                // Save courses if provided
                if (courses && courses.length > 0) {
                    console.log("Saving courses:", courses);
                    for (const courseId of courses) {
                        try {
                            console.log("Creating tutor course:", {
                                tutor_id: savedTutor.id,
                                course_id: courseId,
                            });
                            const result = await createTutorCourse({
                                tutor_id: savedTutor.id,
                                course_id: courseId,
                            });
                            console.log("Course assignment result:", result);
                        } catch (error) {
                            console.error(
                                "Error saving course assignment:",
                                error,
                            );
                            console.error(
                                "Error response:",
                                error.response?.data,
                            );
                            console.error(
                                "Error status:",
                                error.response?.status,
                            );

                            // Handle specific error cases
                            if (error.response?.status === 409) {
                                console.log("Course already assigned to tutor");
                            } else if (error.response?.status === 422) {
                                console.error(
                                    "Validation error:",
                                    error.response?.data?.errors,
                                );
                            } else if (error.response?.status === 404) {
                                console.error("Tutor or course not found");
                            } else {
                                console.error(
                                    "Unexpected error:",
                                    error.message,
                                );
                            }
                        }
                    }
                }

                // Refresh the page to show updated data
                window.location.reload();
            } else {
                // Update existing tutor with availability
                const updateData = {
                    ...basicTutorData,
                    availability: availability || [],
                };

                savedTutor = await updateTutor(selectedTutor.id, updateData);

                // Handle courses separately for updates if needed
                // Note: For now, we'll just handle availability with the update

                // Refresh the page to show updated data
                window.location.reload();
            }

            setShowTutorModal(false);
            setSelectedTutor(null);
        } catch (error) {
            console.error("Error saving tutor:", error);
            throw error;
        }
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (total / ratings.length).toFixed(1);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <Head title="Tutor Management" />
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading tutors...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Tutor Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>
                                    Tutor Management
                                </h1>
                                <p className={styles.subtitle}>
                                    Manage tutors and their profiles
                                </p>
                            </div>
                            <div className={styles.headerButtons}>
                                <button
                                    className={styles.applicationsButton}
                                    onClick={() =>
                                        navigate(ROUTES.ADMIN_TUTOR_APP)
                                    }
                                >
                                    📋 Tutor Applications
                                </button>
                                <button
                                    className={styles.addTutorButton}
                                    onClick={handleCreateTutor}
                                >
                                    + Add New Tutor
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search tutors by name, university, or bio..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>

                        <select
                            value={filterStatus}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Tutors</option>
                            <option value="active">
                                Active (With Courses)
                            </option>
                            <option value="inactive">
                                Inactive (No Courses)
                            </option>
                            <option value="experienced">
                                Experienced (2+ years)
                            </option>
                            <option value="new">New (&lt; 2 years)</option>
                        </select>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredTutors.length}
                            </span>
                            <span className={styles.statLabel}>
                                Total Tutors
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {
                                    (filteredTutors || []).filter(
                                        (tutor) =>
                                            tutor &&
                                            tutor.courses &&
                                            tutor.courses.length > 0,
                                    ).length
                                }
                            </span>
                            <span className={styles.statLabel}>
                                Active Tutors
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {(filteredTutors || []).reduce(
                                    (total, tutor) =>
                                        total +
                                        (tutor && tutor.courses
                                            ? tutor.courses.length
                                            : 0),
                                    0,
                                )}
                            </span>
                            <span className={styles.statLabel}>
                                Total Courses
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredTutors.length > 0
                                    ? (
                                          (filteredTutors || []).reduce(
                                              (total, tutor) =>
                                                  total +
                                                  parseFloat(
                                                      calculateAverageRating(
                                                          tutor && tutor.ratings
                                                              ? tutor.ratings
                                                              : [],
                                                      ) || 0,
                                                  ),
                                              0,
                                          ) / filteredTutors.length
                                      ).toFixed(1)
                                    : "0.0"}
                            </span>
                            <span className={styles.statLabel}>Avg Rating</span>
                        </div>
                    </div>

                    {/* Tutors Grid */}
                    <div className={styles.tutorsGrid}>
                        {(currentTutors || []).filter(Boolean).map((tutor) => (
                            <div key={tutor.id} className={styles.tutorCard}>
                                <div className={styles.tutorHeader}>
                                    <div className={styles.tutorId}>
                                        #{tutor.id}
                                    </div>
                                    <div className={styles.tutorActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleViewTutor(tutor)
                                            }
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleEditTutor(tutor)
                                            }
                                            title="Edit Tutor"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleDeleteTutor(tutor.id)
                                            }
                                            title="Delete Tutor"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.tutorImage}>
                                    {tutor.image || tutor.user?.avatar ? (
                                        <img
                                            src={
                                                tutor.image ||
                                                tutor.user?.avatar
                                            }
                                            alt={tutor.name || tutor.user?.name}
                                        />
                                    ) : (
                                        <div
                                            className={styles.placeholderImage}
                                        >
                                            👨‍🏫
                                        </div>
                                    )}
                                </div>

                                <div className={styles.tutorContent}>
                                    <h3 className={styles.tutorName}>
                                        {tutor.name ||
                                            tutor.user?.name ||
                                            "Unknown Tutor"}
                                    </h3>
                                    <p className={styles.tutorUniversity}>
                                        {tutor.university ||
                                            "No university specified"}
                                    </p>
                                    <p className={styles.tutorBio}>
                                        {tutor.bio || "No bio provided"}
                                    </p>

                                    <div className={styles.tutorStats}>
                                        <div className={styles.statRow}>
                                            <span
                                                className={
                                                    styles.tutorExperience
                                                }
                                            >
                                                📚 {tutor.experience_years || 0}{" "}
                                                years experience
                                            </span>
                                            <span
                                                className={styles.tutorRating}
                                            >
                                                ⭐{" "}
                                                {calculateAverageRating(
                                                    tutor.ratings || [],
                                                )}
                                            </span>
                                        </div>
                                        <div className={styles.statRow}>
                                            <span
                                                className={styles.tutorCourses}
                                            >
                                                🎓{" "}
                                                {tutor.courses
                                                    ? tutor.courses.length
                                                    : 0}{" "}
                                                courses
                                            </span>
                                            <span className={styles.tutorRate}>
                                                💰 ${tutor.hourly_rate || 0}/hr
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.tutorFooter}>
                                        <span className={styles.tutorStatus}>
                                            {tutor.courses &&
                                            tutor.courses.length > 0 ? (
                                                <span
                                                    className={
                                                        styles.activeStatus
                                                    }
                                                >
                                                    🟢 Active
                                                </span>
                                            ) : (
                                                <span
                                                    className={
                                                        styles.inactiveStatus
                                                    }
                                                >
                                                    🔴 Inactive
                                                </span>
                                            )}
                                        </span>
                                        <span className={styles.tutorDate}>
                                            Joined:{" "}
                                            {new Date(
                                                tutor.created_at,
                                            ).toLocaleDateString()}
                                        </span>
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

                    {filteredTutors.length === 0 && (
                        <div className={styles.noResults}>
                            <p>No tutors found matching your criteria.</p>
                        </div>
                    )}
                </div>

                {/* Tutor Details/Edit Modal */}
                {showTutorModal && (
                    <TutorModal
                        tutor={selectedTutor}
                        mode={modalMode}
                        users={users}
                        courses={courses}
                        onClose={() => {
                            setShowTutorModal(false);
                            setSelectedTutor(null);
                            setModalMode("view");
                        }}
                        onSave={handleSaveTutor}
                        setModalMode={setModalMode}
                        createTutorCourse={createTutorCourse}
                        deleteTutorCourse={deleteTutorCourse}
                        updateTutorCourse={updateTutorCourse}
                        calculateAverageRating={calculateAverageRating}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedTutor && (
                    <DeleteConfirmationModal
                        tutor={selectedTutor}
                        onConfirm={confirmDeleteTutor}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedTutor(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}