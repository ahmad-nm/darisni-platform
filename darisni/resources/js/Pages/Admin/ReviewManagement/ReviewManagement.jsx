import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import styles from "./ReviewManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import {
    deleteReview,
    getReviews,
    getReviewStats,
} from "../../../services/admin/reviewManagementService.js";
import { getFilterLabel } from "../../../utils/reviewHelpers.js";
import ReviewStats from "./components/ReviewStats/ReviewStats.jsx";
import ReviewFilters from "./components/ReviewFilters/ReviewFilters";
import ReviewGrid from "./components/ReviewGrid/ReviewGrid.jsx";
import Pagination from "./components/Pagination/Pagination";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal/DeleteConfirmationModal";

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

    const handleDeleteReview = (review) => {
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
                    <ReviewStats stats={stats} />

                    {/* Filters and Search */}
                    <ReviewFilters
                        searchTerm={searchTerm}
                        handleSearchChange={handleSearchChange}
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                    />

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

                        <ReviewGrid
                            reviews={currentReviews}
                            onDelete={handleDeleteReview}
                            processingId={processingId}
                        />

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
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