import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import styles from "./TutorApplications.module.css";
import { navigate } from "@/utils/navigationService";
import { ROUTES } from "@/constants/routes";
import { fetchApplications, updateApplicationStatus, deleteApplication, downloadCV } from "../../../services/admin/tutorApplicationsServices";
import { getStatusBadge, getStatusStats, formatDate } from "../../../utils/tutorApplicationsHelpers";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationModal from "./components/ApplicationModal";
import ApplicationPagination from "./components/ApplicationPagination";
import ApplicationStats from "./components/ApplicationStats";
import ApplicationsFilters from "./components/ApplicationsFilters";
import ApplicationsLoader from "./components/ApplicationsLoader";

export default function TutorApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [duplicateUserIds, setDuplicateUserIds] = useState([]);
    const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const applicationsPerPage = 8;
    const stats = getStatusStats(applications);

    // Fetch applications from Laravel API
    useEffect(() => {
        const loadApplications = async () => {
            try {
                setLoading(true);

                const data = await fetchApplications();

                if (data.success) {
                    setDuplicateUserIds(data.duplicate_user_ids || []);

                    const sortedApplications = data.applications
                        .map((app) => ({
                            ...app,
                            status: app.status || "pending",
                            isDuplicate: (data.duplicate_user_ids || [])
                                .map(String)
                                .includes(String(app.user_id)),
                        }))
                        .sort(
                            (a, b) =>
                                new Date(b.submitted_at) -
                                new Date(a.submitted_at),
                        );

                    setApplications(sortedApplications);
                    setFilteredApplications(sortedApplications);
                } else {
                    setApplications([]);
                    setFilteredApplications([]);
                }
            } catch (error) {
                console.error(error);
                setApplications([]);
                setFilteredApplications([]);
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let filtered = applications.filter(
            (app) =>
                app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.university
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase()),
        );

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((app) => app.status === statusFilter);
        }

        if (showDuplicatesOnly) {
            filtered = filtered.filter((app) => app.isDuplicate);
        }

        setFilteredApplications(filtered);
        setCurrentPage(1);
    }, [searchQuery, statusFilter, showDuplicatesOnly, applications]);

    // Pagination
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication =
        indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredApplications.slice(
        indexOfFirstApplication,
        indexOfLastApplication,
    );
    const totalPages = Math.ceil(
        filteredApplications.length / applicationsPerPage,
    );

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
    };

    const handleDownloadCV = (applicationId) => {
        window.open(`/admin/applications/${applicationId}/cv`, "_blank");
    };

    const handleAcceptTutor = async () => {
        if (!selectedApplication) return;

        try {
            if (!selectedApplication.user_id) {
                alert(
                    "Cannot accept application: No user ID found. The applicant needs to be a registered user.",
                );
                return;
            }

            // Get fresh CSRF token
            const data = await updateApplicationStatus(
                selectedApplication.id,
                "approved",
            );

            if (data.success) {
                // Update application status in frontend
                const updatedApplications = applications.map((app) =>
                    app.id === selectedApplication.id
                        ? { ...app, status: "approved" }
                        : app,
                );
                setApplications(updatedApplications);

                // Automatically open WhatsApp with success message
                if (data.whatsapp_message) {
                    if (
                        window.confirm(
                            `✅ Application approved and tutor profile created successfully!\n\nClick OK to send WhatsApp notification to ${selectedApplication.name}.`,
                        )
                    ) {
                        window.open(data.whatsapp_message.url, "_blank");
                    }
                } else {
                    alert(
                        "✅ Application approved and tutor profile created successfully!",
                    );
                }
            } else {
                console.error("Server response:", response.status, data);
                alert(
                    "Failed to update application status: " +
                        (data.message || "Unknown error"),
                );
            }
        } catch (error) {
            console.error("Error accepting application:", error);
            alert(
                "Failed to accept application. Please check your connection and try again.",
            );
        } finally {
            handleCloseModal();
        }
    };

    const handleRejectTutor = async () => {
        if (!selectedApplication) return;

        try {
            // Get fresh CSRF token
            const data = await updateApplicationStatus(
                selectedApplication.id,
                "rejected",
            );

            if (data.success) {
                // Update application status in frontend
                const updatedApplications = applications.map((app) =>
                    app.id === selectedApplication.id
                        ? { ...app, status: "rejected" }
                        : app,
                );
                setApplications(updatedApplications);

                // Automatically open WhatsApp with rejection message
                if (data.whatsapp_message) {
                    if (
                        window.confirm(
                            `❌ Application rejected.\n\nClick OK to send WhatsApp notification to ${selectedApplication.name}.`,
                        )
                    ) {
                        window.open(data.whatsapp_message.url, "_blank");
                    }
                } else {
                    alert("❌ Application rejected.");
                }
            } else {
                console.error("Server response:", response.status, data);
                alert(
                    "Failed to update application status: " +
                        (data.message || "Unknown error"),
                );
            }
        } catch (error) {
            console.error("Error rejecting application:", error);
            alert(
                "Failed to reject application. Please check your connection and try again.",
            );
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteApplication = async () => {
        if (!selectedApplication) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to permanently delete the application from ${selectedApplication.name}? This action cannot be undone and will remove all associated files.`,
        );

        if (!confirmDelete) return;

        try {
            const data = await deleteApplication(selectedApplication.id);
            if (data.success) {
                const updatedApplications = applications.filter(
                    (app) => app.id !== selectedApplication.id,
                );

                setApplications(updatedApplications);

                alert("Application deleted successfully!");
            } else {
                alert("Failed to delete application: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            alert("Failed to delete application. Please try again.");
        } finally {
            handleCloseModal();
        }
    };

    if (loading) {
        return <ApplicationsLoader />;
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <button
                                    className={styles.backButton}
                                    onClick={() =>
                                        navigate(ROUTES.ADMIN_TUTORS)
                                    }
                                >
                                    ← Back to Tutor Management
                                </button>
                                <h1 className={styles.title}>
                                    Tutor Applications
                                </h1>
                                <p className={styles.subtitle}>
                                    Review applications from users wanting to
                                    become tutors
                                </p>
                            </div>
                            <ApplicationStats stats={stats} />
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <ApplicationsFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        showDuplicatesOnly={showDuplicatesOnly}
                        setShowDuplicatesOnly={setShowDuplicatesOnly}
                    />

                    {/* Applications Grid */}
                    {currentApplications.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📋</div>
                            <h3>No Applications Found</h3>
                            <p>
                                There are currently no tutor applications to
                                review.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.applicationsGrid}>
                                {currentApplications.map(
                                    (application, index) => (
                                        <ApplicationCard
                                            key={
                                                application.id ||
                                                application.file_id ||
                                                index
                                            }
                                            application={application}
                                            onView={handleViewApplication}
                                            getStatusBadge={getStatusBadge}
                                        />
                                    ),
                                )}
                            </div>

                            {/* Pagination */}
                            <ApplicationPagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </>
                    )}

                    {/* Application Details Modal */}
                    <ApplicationModal
                        showModal={showModal}
                        selectedApplication={selectedApplication}
                        onClose={handleCloseModal}
                        onAccept={handleAcceptTutor}
                        onReject={handleRejectTutor}
                        onDelete={handleDeleteApplication}
                        onDownloadCV={downloadCV}
                        formatDate={formatDate}
                        getStatusBadge={getStatusBadge}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}