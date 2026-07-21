import styles from "../TutorApplications.module.css";

export default function ApplicationCard({
    application,
    onView,
    getStatusBadge,
}) {
    return (
        <div className={styles.applicationCard}>
            <div className={styles.cardHeader}>
                <h3 className={styles.applicantName}>{application.name}</h3>

                {application.isDuplicate && (
                    <span className={styles.duplicateBadge}>
                        Duplicate(
                        {application.user_id})
                    </span>
                )}

                <div
                    className={`${styles.statusBadge} ${styles[getStatusBadge(application.status || "pending").className]}`}
                >
                    {getStatusBadge(application.status || "pending").text}
                </div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.applicantInfo}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Email:</span>
                        <span className={styles.infoValue}>
                            {application.email}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>University:</span>
                        <span className={styles.infoValue}>
                            {application.university}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Age:</span>
                        <span className={styles.infoValue}>
                            {application.age}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Expected Pay:</span>
                        <span className={styles.infoValue}>
                            ${application.expected_hourly_rate}
                            /hour
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>CV:</span>
                        <span
                            className={`${styles.infoValue} ${application.cv_filename ? styles.cvAvailable : styles.cvNotAvailable}`}
                        >
                            {application.cv_filename
                                ? "📄 Available"
                                : "❌ Not uploaded"}
                        </span>
                    </div>
                </div>

                <div className={styles.coursesPreview}>
                    <span className={styles.coursesLabel}>
                        Courses to teach:
                    </span>
                    <div className={styles.coursesList}>
                        {(application.courses_to_give || [])
                            .slice(0, 3)
                            .map((course, idx) => (
                                <span key={idx} className={styles.courseTag}>
                                    {course}
                                </span>
                            ))}
                        {(application.courses_to_give || []).length > 3 && (
                            <span className={styles.moreCoursesTag}>
                                +
                                {(application.courses_to_give || []).length - 3}{" "}
                                more
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.cardActions}>
                <button
                    className={styles.viewButton}
                    onClick={() => onView(application)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
