import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import styles from './TutorApplications.module.css';

export default function TutorApplications() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [duplicateUserIds, setDuplicateUserIds] = useState([]);
    const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const applicationsPerPage = 8;

    // Fetch applications from Laravel API
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await fetch('/admin/applications/data', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setDuplicateUserIds(data.duplicate_user_ids || []);
                        const sortedApplications = data.applications.map(app => ({
                            ...app,
                            status: app.status || 'pending',
                            isDuplicate: (data.duplicate_user_ids || []).map(String).includes(String(app.user_id))
                        })).sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
                        setApplications(sortedApplications);
                        setFilteredApplications(sortedApplications);
                    } else {
                        setApplications([]);
                        setFilteredApplications([]);
                    }
                } else {
                    setApplications([]);
                    setFilteredApplications([]);
                }
            } catch (error) {
                setApplications([]);
                setFilteredApplications([]);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let filtered = applications.filter(app =>
            app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.university?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if(showDuplicatesOnly) {
            filtered = filtered.filter(app => app.isDuplicate);
        }

        setFilteredApplications(filtered);
        setCurrentPage(1);
    }, [searchQuery, statusFilter, showDuplicatesOnly, applications]);

    // Pagination
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
    const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedApplication(null);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { text: 'Pending', className: 'pendingBadge' },
            approved: { text: 'Approved', className: 'acceptedBadge' },
            rejected: { text: 'Rejected', className: 'rejectedBadge' },
            under_review: { text: 'Under Review', className: 'pendingBadge' }
        };
        return badges[status] || badges.pending;
    };

    const getStatusStats = () => {
        const stats = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});
        return {
            total: applications.length,
            pending: stats.pending || 0,
            approved: stats.approved || 0,
            rejected: stats.rejected || 0
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        try {
            return new Date(dateString).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const handleDownloadCV = (applicationId) => {
        window.open(`/admin/applications/${applicationId}/cv`, '_blank');
    };

    const handleAcceptTutor = async () => {
        if (!selectedApplication) return;

        try {
            if (!selectedApplication.user_id) {
                alert('Cannot accept application: No user ID found. The applicant needs to be a registered user.');
                return;
            }

            // Get fresh CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!csrfToken) {
                alert('Security token not found. Please refresh the page and try again.');
                return;
            }

            // Update application status
            const response = await fetch(`/admin/applications/${selectedApplication.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ status: 'approved' }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                // Update application status in frontend
                const updatedApplications = applications.map(app => 
                    app.id === selectedApplication.id ? { ...app, status: 'approved' } : app
                );
                setApplications(updatedApplications);
                
                // Automatically open WhatsApp with success message
                if (data.whatsapp_message) {
                    if (window.confirm(`✅ Application approved and tutor profile created successfully!\n\nClick OK to send WhatsApp notification to ${selectedApplication.name}.`)) {
                        window.open(data.whatsapp_message.url, '_blank');
                    }
                } else {
                    alert('✅ Application approved and tutor profile created successfully!');
                }
            } else {
                console.error('Server response:', response.status, data);
                if (response.status === 419) {
                    alert('Security token expired. Please refresh the page and try again.');
                } else {
                    alert('Failed to update application status: ' + (data.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error accepting application:', error);
            alert('Failed to accept application. Please check your connection and try again.');
        } finally {
            handleCloseModal();
        }
    };

    const handleRejectTutor = async () => {
        if (!selectedApplication) return;

        try {
            // Get fresh CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!csrfToken) {
                alert('Security token not found. Please refresh the page and try again.');
                return;
            }

            const response = await fetch(`/admin/applications/${selectedApplication.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({ status: 'rejected' }),
                credentials: 'same-origin'
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                // Update application status in frontend
                const updatedApplications = applications.map(app => 
                    app.id === selectedApplication.id ? { ...app, status: 'rejected' } : app
                );
                setApplications(updatedApplications);
                
                // Automatically open WhatsApp with rejection message
                if (data.whatsapp_message) {
                    if (window.confirm(`❌ Application rejected.\n\nClick OK to send WhatsApp notification to ${selectedApplication.name}.`)) {
                        window.open(data.whatsapp_message.url, '_blank');
                    }
                } else {
                    alert('❌ Application rejected.');
                }
            } else {
                console.error('Server response:', response.status, data);
                if (response.status === 419) {
                    alert('Security token expired. Please refresh the page and try again.');
                } else {
                    alert('Failed to update application status: ' + (data.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            alert('Failed to reject application. Please check your connection and try again.');
        } finally {
            handleCloseModal();
        }
    };

    const handleDeleteApplication = async () => {
        if (!selectedApplication) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to permanently delete the application from ${selectedApplication.name}? This action cannot be undone and will remove all associated files.`
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`/admin/applications/${selectedApplication.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Remove application from the local state
                    const updatedApplications = applications.filter(app => app.id !== selectedApplication.id);
                    setApplications(updatedApplications);
                    
                    alert('Application deleted successfully!');
                } else {
                    alert('Failed to delete application: ' + data.message);
                }
            } else {
                alert('Failed to delete application.');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('Failed to delete application. Please try again.');
        } finally {
            handleCloseModal();
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={styles.container}>
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Loading applications...</p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
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
                                onClick={() => router.visit('/admin/tutors')}
                            >
                                ← Back to Tutor Management
                            </button>
                            <h1 className={styles.title}>Tutor Applications</h1>
                            <p className={styles.subtitle}>
                                Review applications from users wanting to become tutors
                            </p>
                        </div>
                        <div className={styles.statsContainer}>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>{getStatusStats().total}</span>
                                <span className={styles.statLabel}>Total</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>{getStatusStats().pending}</span>
                                <span className={styles.statLabel}>Pending</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>{getStatusStats().approved}</span>
                                <span className={styles.statLabel}>Approved</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>{getStatusStats().rejected}</span>
                                <span className={styles.statLabel}>Rejected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className={styles.filtersContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search by name, email, or university..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={styles.statusFilter}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="under_review">Under Review</option>
                        </select>

                        <label className={styles.duplicateFilterLabel}>
                            <input
                                type="checkbox"
                                checked={showDuplicatesOnly}
                                onChange={e => setShowDuplicatesOnly(e.target.checked)}
                                className={styles.duplicateFilterCheckbox}
                            />
                            Show only duplicate applications
                        </label>
                    </div>
                </div>

                {/* Applications Grid */}
                {currentApplications.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📋</div>
                        <h3>No Applications Found</h3>
                        <p>There are currently no tutor applications to review.</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.applicationsGrid}>
                            {currentApplications.map((application, index) => (
                                <div key={application.id || application.file_id || index} className={styles.applicationCard}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.applicantName}>{application.name}</h3>
                                        
                                        {application.isDuplicate && (
                                            <span className={styles.duplicateBadge}>
                                                Duplicate({application.user_id})
                                            </span>
                                        )}
                                        
                                        <div className={`${styles.statusBadge} ${styles[getStatusBadge(application.status || 'pending').className]}`}>
                                            {getStatusBadge(application.status || 'pending').text}
                                        </div>
                                    </div>
                                    
                                    <div className={styles.cardContent}>
                                        <div className={styles.applicantInfo}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Email:</span>
                                                <span className={styles.infoValue}>{application.email}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>University:</span>
                                                <span className={styles.infoValue}>{application.university}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Age:</span>
                                                <span className={styles.infoValue}>{application.age}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Expected Pay:</span>
                                                <span className={styles.infoValue}>${application.expected_hourly_rate}/hour</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>CV:</span>
                                                <span className={`${styles.infoValue} ${application.cv_filename ? styles.cvAvailable : styles.cvNotAvailable}`}>
                                                    {application.cv_filename ? '📄 Available' : '❌ Not uploaded'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.coursesPreview}>
                                            <span className={styles.coursesLabel}>Courses to teach:</span>
                                            <div className={styles.coursesList}>
                                                {(application.courses_to_give || []).slice(0, 3).map((course, idx) => (
                                                    <span key={idx} className={styles.courseTag}>{course}</span>
                                                ))}
                                                {(application.courses_to_give || []).length > 3 && (
                                                    <span className={styles.moreCoursesTag}>
                                                        +{(application.courses_to_give || []).length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.cardActions}>
                                        <button 
                                            className={styles.viewButton}
                                            onClick={() => handleViewApplication(application)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={styles.paginationButton}
                                >
                                    Previous
                                </button>
                                
                                <div className={styles.pageNumbers}>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`${styles.pageNumber} ${currentPage === pageNum ? styles.active : ''}`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={styles.paginationButton}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Application Details Modal */}
                {showModal && selectedApplication && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h2>Application Details</h2>
                                <button 
                                    className={styles.closeButton}
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className={styles.modalBody}>
                                <div className={styles.applicantDetails}>
                                    <h3>Personal Information</h3>
                                    <div className={styles.detailsGrid}>
                                        <div className={styles.detailItem}>
                                            <strong>Name:</strong> {selectedApplication.name}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Email:</strong> {selectedApplication.email}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Phone:</strong> {selectedApplication.phone}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Age:</strong> {selectedApplication.age}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>University:</strong> {selectedApplication.university}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Year:</strong> {selectedApplication.year}
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Expected Pay:</strong> ${selectedApplication.expected_hourly_rate}/hour
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>User Status:</strong> 
                                            <span className={selectedApplication.user_id ? styles.userRegistered : styles.userNotRegistered}>
                                                {selectedApplication.user_id ? ' ✓ Registered User' : ' ⚠️ Not Registered'}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Application Status:</strong> 
                                            <span className={`${styles.statusBadge} ${styles[getStatusBadge(selectedApplication.status || 'pending').className]}`}>
                                                {getStatusBadge(selectedApplication.status || 'pending').text}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <strong>Submitted:</strong> {formatDate(selectedApplication.submitted_at)}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.coursesSection}>
                                    <h3>Courses to Teach</h3>
                                    <div className={styles.coursesFullList}>
                                        {(selectedApplication.courses_to_give || []).map((course, idx) => (
                                            <span key={idx} className={styles.courseTagLarge}>{course}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.questionsSection}>
                                    <h3>Responses</h3>
                                    <div className={styles.questionItem}>
                                        <strong>Where do you see yourself in the future?</strong>
                                        <p>{selectedApplication.where_you_see_yourself}</p>
                                    </div>
                                    <div className={styles.questionItem}>
                                        <strong>What makes you a good tutor?</strong>
                                        <p>{selectedApplication.what_makes_good_tutor}</p>
                                    </div>
                                    {selectedApplication.other_courses && (
                                        <div className={styles.questionItem}>
                                            <strong>Other courses to teach:</strong>
                                            <p>{selectedApplication.other_courses}</p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.documentSection}>
                                    <h3>Documents</h3>
                                    {selectedApplication.cv_filename ? (
                                        <div className={styles.cvContainer}>
                                            <div className={styles.cvInfo}>
                                                <span className={styles.documentIcon}>📄</span>
                                                <div className={styles.cvDetails}>
                                                    <span className={styles.cvLabel}>CV/Resume:</span>
                                                    <span className={styles.cvFilename}>
                                                        {selectedApplication.cv_filename}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.cvActions}>
                                                <button 
                                                    className={styles.viewCVButton}
                                                    onClick={() => handleDownloadCV(selectedApplication.id)}
                                                >
                                                    📖 View CV
                                                </button>
                                                <button 
                                                    className={styles.downloadCVButton}
                                                    onClick={() => handleDownloadCV(selectedApplication.id)}
                                                >
                                                    📥 Download
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.noCvContainer}>
                                            <span className={styles.documentIcon}>❌</span>
                                            <span className={styles.noCvText}>No CV/Resume uploaded</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                {(!selectedApplication.status || selectedApplication.status === 'pending') && (
                                    <>
                                        <button 
                                            className={styles.acceptButton}
                                            onClick={handleAcceptTutor}
                                        >
                                            Accept Application
                                        </button>
                                        <button 
                                            className={styles.rejectButton}
                                            onClick={handleRejectTutor}
                                        >
                                            Reject Application
                                        </button>
                                    </>
                                )}
                                {selectedApplication.status === 'approved' && (
                                    <div className={styles.statusMessage}>
                                        <span className={styles.acceptedMessage}>✓ This application has been approved</span>
                                    </div>
                                )}
                                {selectedApplication.status === 'rejected' && (
                                    <div className={styles.statusMessage}>
                                        <span className={styles.rejectedMessage}>✗ This application has been rejected</span>
                                    </div>
                                )}
                                <button 
                                    className={styles.deleteButton}
                                    onClick={handleDeleteApplication}
                                >
                                    🗑️ Delete Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </AdminLayout>
    );
}
