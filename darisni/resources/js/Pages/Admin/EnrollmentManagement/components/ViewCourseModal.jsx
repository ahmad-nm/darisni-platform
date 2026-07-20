import styles from '../EnrollmentManagement.module.css';

export default function ViewCoursesModal({ user, onClose, handleDeleteEnrollment, loading }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{user.name}'s Enrolled Courses</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalForm}>
                    {user.enrollments.length === 0 ? (
                        <div>No courses enrolled.</div>
                    ) : (
                        <ul style={{ padding: 0, margin: 0 }}>
                            {user.enrollments.map((e) => (
                                <li
                                    key={e.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        marginBottom: 12,
                                    }}
                                >
                                    <span className={styles.courseCode}>
                                        {e.course?.code}
                                    </span>
                                    <span style={{ flex: 1 }}>
                                        {e.course?.title}
                                    </span>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() =>
                                            handleDeleteEnrollment(e.id)
                                        }
                                        disabled={loading}
                                    >
                                        🗑️ Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
