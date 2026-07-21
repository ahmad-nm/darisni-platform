import styles from "../TutorApplications.module.css";

export default function ApplicationModal({
    showModal,
    selectedApplication,
    onClose,
    onAccept,
    onReject,
    onDelete,
    onDownloadCV,
    formatDate,
    getStatusBadge,
}) {
    if (!showModal || !selectedApplication) return null;

    return (
        <>
            {showModal && selectedApplication && (
                <div className={styles.modalOverlay} onClick={onClose}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Application Details</h2>
                            <button
                                className={styles.closeButton}
                                onClick={onClose}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.applicantDetails}>
                                <h3>Personal Information</h3>
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <strong>Name:</strong>{" "}
                                        {selectedApplication.name}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Email:</strong>{" "}
                                        {selectedApplication.email}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Phone:</strong>{" "}
                                        {selectedApplication.phone}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Age:</strong>{" "}
                                        {selectedApplication.age}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>University:</strong>{" "}
                                        {selectedApplication.university}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Year:</strong>{" "}
                                        {selectedApplication.year}
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Expected Pay:</strong> $
                                        {
                                            selectedApplication.expected_hourly_rate
                                        }
                                        /hour
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>User Status:</strong>
                                        <span
                                            className={
                                                selectedApplication.user_id
                                                    ? styles.userRegistered
                                                    : styles.userNotRegistered
                                            }
                                        >
                                            {selectedApplication.user_id
                                                ? " ✓ Registered User"
                                                : " ⚠️ Not Registered"}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Application Status:</strong>
                                        <span
                                            className={`${styles.statusBadge} ${styles[getStatusBadge(selectedApplication.status || "pending").className]}`}
                                        >
                                            {
                                                getStatusBadge(
                                                    selectedApplication.status ||
                                                        "pending",
                                                ).text
                                            }
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <strong>Submitted:</strong>{" "}
                                        {formatDate(
                                            selectedApplication.submitted_at,
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.coursesSection}>
                                <h3>Courses to Teach</h3>
                                <div className={styles.coursesFullList}>
                                    {(
                                        selectedApplication.courses_to_give ||
                                        []
                                    ).map((course, idx) => (
                                        <span
                                            key={idx}
                                            className={styles.courseTagLarge}
                                        >
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.questionsSection}>
                                <h3>Responses</h3>
                                <div className={styles.questionItem}>
                                    <strong>
                                        Where do you see yourself in the future?
                                    </strong>
                                    <p>
                                        {
                                            selectedApplication.where_you_see_yourself
                                        }
                                    </p>
                                </div>
                                <div className={styles.questionItem}>
                                    <strong>
                                        What makes you a good tutor?
                                    </strong>
                                    <p>
                                        {
                                            selectedApplication.what_makes_good_tutor
                                        }
                                    </p>
                                </div>
                                {selectedApplication.other_courses && (
                                    <div className={styles.questionItem}>
                                        <strong>Other courses to teach:</strong>
                                        <p>
                                            {selectedApplication.other_courses}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.documentSection}>
                                <h3>Documents</h3>
                                {selectedApplication.cv_filename ? (
                                    <div className={styles.cvContainer}>
                                        <div className={styles.cvInfo}>
                                            <span
                                                className={styles.documentIcon}
                                            >
                                                📄
                                            </span>
                                            <div className={styles.cvDetails}>
                                                <span
                                                    className={styles.cvLabel}
                                                >
                                                    CV/Resume:
                                                </span>
                                                <span
                                                    className={
                                                        styles.cvFilename
                                                    }
                                                >
                                                    {
                                                        selectedApplication.cv_filename
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.cvActions}>
                                            <button
                                                className={styles.viewCVButton}
                                                onClick={() =>
                                                    onDownloadCV(
                                                        selectedApplication.id,
                                                    )
                                                }
                                            >
                                                📖 View CV
                                            </button>
                                            <button
                                                className={
                                                    styles.downloadCVButton
                                                }
                                                onClick={() =>
                                                    onDownloadCV(
                                                        selectedApplication.id,
                                                    )
                                                }
                                            >
                                                📥 Download
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noCvContainer}>
                                        <span className={styles.documentIcon}>
                                            ❌
                                        </span>
                                        <span className={styles.noCvText}>
                                            No CV/Resume uploaded
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            {(!selectedApplication.status ||
                                selectedApplication.status === "pending") && (
                                <>
                                    <button
                                        className={styles.acceptButton}
                                        onClick={onAccept}
                                    >
                                        Accept Application
                                    </button>
                                    <button
                                        className={styles.rejectButton}
                                        onClick={onReject}
                                    >
                                        Reject Application
                                    </button>
                                </>
                            )}
                            {selectedApplication.status === "approved" && (
                                <div className={styles.statusMessage}>
                                    <span className={styles.acceptedMessage}>
                                        ✓ This application has been approved
                                    </span>
                                </div>
                            )}
                            {selectedApplication.status === "rejected" && (
                                <div className={styles.statusMessage}>
                                    <span className={styles.rejectedMessage}>
                                        ✗ This application has been rejected
                                    </span>
                                </div>
                            )}
                            <button
                                className={styles.deleteButton}
                                onClick={onDelete}
                            >
                                🗑️ Delete Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
