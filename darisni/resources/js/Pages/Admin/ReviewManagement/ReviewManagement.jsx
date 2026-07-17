import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import styles from "./ReviewManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";

export default function ReviewManagement({
    reviews: initialReviews,
    stats: initialStats,
}) {
    const [reviews, setReviews] = useState(initialReviews || []);
    const [filteredReviews, setFilteredReviews] = useState(
        initialReviews || [],
    );
    const [stats, setStats] = useState(
        initialStats || {
            total_reviews: 0,
            course_reviews: 0,
            tutor_reviews: 0,
            darisni_reviews: 0,
            average_ratings: {
                overall: 0,
                course: 0,
                tutor: 0,
                darisni: 0,
            },
            recent_reviews: {
                total: 0,
                course: 0,
                tutor: 0,
                darisni: 0,
            },
        },
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("latest");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const reviewsPerPage = 12;

    useEffect(() => {
        if (initialReviews && initialReviews.length >= 0) {
            setReviews(initialReviews);
            setFilteredReviews(initialReviews);
        }
        if (initialStats) setStats(initialStats);
    }, [initialReviews, initialStats]);

    useEffect(() => {
        // Client-side filtering when filter or search changes
        let filtered = reviews;

        if (filter !== "latest") {
            filtered = filtered.filter((review) => review.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (review) =>
                    review.user?.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    review.subject?.title
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    review.feedback
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        setFilteredReviews(filtered);
        setCurrentPage(1);
    }, [filter, searchTerm, reviews]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getReviews(filter, searchTerm);
            setReviews(response.data || []);
            setFilteredReviews(response.data || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews. Please try again.");
            setReviews([]);
            setFilteredReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getReviewStats();
            setStats(response);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const deleteReview = async (id, type) => {
        return router.delete(`/admin/reviews/${id}`, {
            data: { type }, // send the type as data
            preserveScroll: true,
            onSuccess: () => {},
            onError: () => {},
        });
    };

    const handleDeleteReview = async (review) => {
        setSelectedReview(review);
        setShowDeleteModal(true);
    };

    const confirmDeleteReview = async () => {
        if (!selectedReview) return;

        try {
            setProcessingId(selectedReview.id);
            await deleteReview(selectedReview.id, selectedReview.type);

            // Remove review from local state
            const updatedReviews = reviews.filter(
                (review) => review.id !== selectedReview.id,
            );
            setReviews(updatedReviews);
            setFilteredReviews(updatedReviews);

            // Refresh stats
            fetchStats();

            setShowDeleteModal(false);
            setSelectedReview(null);
        } catch (error) {
            console.error("Error deleting review:", error);
            setError("Failed to delete review. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(
        indexOfFirstReview,
        indexOfLastReview,
    );
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getFilterLabel = (filterType) => {
        switch (filterType) {
            case "course":
                return "Course Reviews";
            case "tutor":
                return "Tutor Reviews";
            case "darisni":
                return "Platform Reviews";
            default:
                return "All Reviews";
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                className={
                    index < rating ? styles.starFilled : styles.starEmpty
                }
            >
                ⭐
            </span>
        ));
    };

    const getReviewTypeIcon = (type) => {
        switch (type) {
            case "course":
                return "📚";
            case "tutor":
                return "👨‍🏫";
            case "darisni":
                return "🏢";
            default:
                return "📝";
        }
    };

    const getReviewTypeColor = (type) => {
        switch (type) {
            case "course":
                return "#4CAF50";
            case "tutor":
                return "#2196F3";
            case "darisni":
                return "#FF9800";
            default:
                return "#757575";
        }
    };

    if (loading && reviews.length === 0) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading reviews...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Review Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>
                                    Reviews Management
                                </h1>
                                <p className={styles.subtitle}>
                                    Manage all platform reviews and ratings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📊</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.total_reviews}
                                </span>
                                <span className={styles.statLabel}>
                                    Total Reviews
                                </span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📚</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.course_reviews}
                                </span>
                                <span className={styles.statLabel}>
                                    Course Reviews
                                </span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>👨‍🏫</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.tutor_reviews}
                                </span>
                                <span className={styles.statLabel}>
                                    Tutor Reviews
                                </span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🏢</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.darisni_reviews}
                                </span>
                                <span className={styles.statLabel}>
                                    Platform Reviews
                                </span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>⭐</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.average_ratings?.overall || 0}
                                </span>
                                <span className={styles.statLabel}>
                                    Avg Rating
                                </span>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🆕</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statNumber}>
                                    {stats.recent_reviews?.total || 0}
                                </span>
                                <span className={styles.statLabel}>
                                    Recent (7 days)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search reviews by user, course, or content..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>

                        <div className={styles.filterContainer}>
                            <div className={styles.filterButtons}>
                                <button
                                    className={`${styles.filterBtn} ${filter === "latest" ? styles.active : ""}`}
                                    onClick={() => handleFilterChange("latest")}
                                >
                                    📅 Latest
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filter === "course" ? styles.active : ""}`}
                                    onClick={() => handleFilterChange("course")}
                                >
                                    📚 Courses
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filter === "tutor" ? styles.active : ""}`}
                                    onClick={() => handleFilterChange("tutor")}
                                >
                                    👨‍🏫 Tutors
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filter === "darisni" ? styles.active : ""}`}
                                    onClick={() =>
                                        handleFilterChange("darisni")
                                    }
                                >
                                    🏢 Platform
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            <p>{error}</p>
                            <button
                                onClick={fetchReviews}
                                className={styles.retryBtn}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Reviews Grid */}
                    <div className={styles.reviewsContainer}>
                        <div className={styles.resultsHeader}>
                            <h3>
                                {getFilterLabel(filter)} (
                                {filteredReviews.length})
                            </h3>
                        </div>

                        {currentReviews.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📝</div>
                                <h3>No reviews found</h3>
                                <p>
                                    No reviews match your current filter and
                                    search criteria.
                                </p>
                            </div>
                        ) : (
                            <div className={styles.reviewsGrid}>
                                {currentReviews.map((review) => (
                                    <div
                                        key={`${review.type}-${review.id}`}
                                        className={styles.reviewCard}
                                    >
                                        <div className={styles.reviewHeader}>
                                            <div className={styles.reviewType}>
                                                <span
                                                    className={styles.typeIcon}
                                                    style={{
                                                        backgroundColor:
                                                            getReviewTypeColor(
                                                                review.type,
                                                            ),
                                                    }}
                                                >
                                                    {getReviewTypeIcon(
                                                        review.type,
                                                    )}
                                                </span>
                                                <span
                                                    className={styles.typeName}
                                                >
                                                    {review.subject?.type ||
                                                        "Review"}
                                                </span>
                                            </div>
                                            <div
                                                className={styles.reviewActions}
                                            >
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review,
                                                        )
                                                    }
                                                    disabled={
                                                        processingId ===
                                                        review.id
                                                    }
                                                    title="Delete Review"
                                                >
                                                    {processingId === review.id
                                                        ? "⏳"
                                                        : "🗑️"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.reviewContent}>
                                            <div className={styles.subjectInfo}>
                                                <h4
                                                    className={
                                                        styles.subjectTitle
                                                    }
                                                >
                                                    {review.subject?.title ||
                                                        "Unknown"}
                                                </h4>
                                                <span
                                                    className={
                                                        styles.subjectCode
                                                    }
                                                >
                                                    {review.subject?.code || ""}
                                                </span>
                                            </div>

                                            <div className={styles.rating}>
                                                {renderStars(review.rating)}
                                                <span
                                                    className={
                                                        styles.ratingValue
                                                    }
                                                >
                                                    ({review.rating})
                                                </span>
                                            </div>

                                            {review.feedback && (
                                                <div
                                                    className={styles.feedback}
                                                >
                                                    <p>"{review.feedback}"</p>
                                                </div>
                                            )}

                                            <div className={styles.reviewMeta}>
                                                <div
                                                    className={styles.userInfo}
                                                >
                                                    <span
                                                        className={
                                                            styles.userName
                                                        }
                                                    >
                                                        👤{" "}
                                                        {review.user?.name ||
                                                            "Anonymous"}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.userEmail
                                                        }
                                                    >
                                                        {review.user?.email ||
                                                            ""}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        styles.reviewDate
                                                    }
                                                >
                                                    {formatDate(
                                                        review.created_at,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && selectedReview && (
                        <DeleteConfirmationModal
                            review={selectedReview}
                            onConfirm={confirmDeleteReview}
                            onCancel={() => {
                                setShowDeleteModal(false);
                                setSelectedReview(null);
                            }}
                            processing={processingId === selectedReview.id}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ review, onConfirm, onCancel, processing }) {
    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div
                className={styles.deleteModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteModalHeader}>
                    <h3>Confirm Delete Review</h3>
                </div>

                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this review?</p>

                    <div className={styles.reviewPreview}>
                        <div className={styles.previewHeader}>
                            <span className={styles.reviewTypeLabel}>
                                {review.subject?.type} Review
                            </span>
                            <div className={styles.previewRating}>
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={
                                            index < review.rating
                                                ? styles.starFilled
                                                : styles.starEmpty
                                        }
                                    >
                                        ⭐
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={styles.previewContent}>
                            <strong>{review.subject?.title}</strong>
                            <p className={styles.previewUser}>
                                By: {review.user?.name}
                            </p>
                            {review.feedback && (
                                <p className={styles.previewFeedback}>
                                    "{review.feedback}"
                                </p>
                            )}
                        </div>
                    </div>

                    <p className={styles.warning}>
                        This action cannot be undone.
                    </p>
                </div>

                <div className={styles.deleteModalActions}>
                    <button
                        onClick={onCancel}
                        className={styles.cancelBtn}
                        disabled={processing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={styles.deleteConfirmBtn}
                        disabled={processing}
                    >
                        {processing ? "Deleting..." : "Delete Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}
