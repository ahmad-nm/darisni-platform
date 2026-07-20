import styles from "../../CourseManagement.module.css";

export default function CourseDetails({
    course,
    categoryName,
    tutorName,
    onClose,
    setModalMode,
}) {
    return (
        <div className={styles.courseDetailsView}>
            <div className={styles.courseImageSection}>
                {course.image ? (
                    <img
                        src={course.image}
                        alt={course.title}
                        className={styles.courseImageLarge}
                    />
                ) : (
                    <div className={styles.placeholderImageLarge}>📚</div>
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
                    <span>{categoryName}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Tutor</label>
                    <span>{tutorName}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Subject</label>
                    <span>{course.subject || "Not specified"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Price</label>
                    <span>{course.price ? `$${course.price}` : "Free"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Lectures</label>
                    <span>{course.lectures || "Not specified"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Credits</label>
                    <span>{course.credits || "Not specified"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Semester</label>
                    <span>{course.semester || "Not specified"}</span>
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
                        {new Date(course.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className={styles.modalActions}>
                <button onClick={onClose} className={styles.cancelBtn}>
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
    );
}