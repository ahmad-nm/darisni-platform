import { useState } from "react";
import styles from "../EnrollmentManagement.module.css";

// Modal for enrolling user in a course
export default function EnrollModal({ user, courses = [], onClose, onEnroll, loading }) {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [search, setSearch] = useState("");

    // Filter out courses already enrolled
    const enrolledIds = user.enrollments.map((e) => e.course_id);
    const filteredCourses = courses
        .filter((course) => !enrolledIds.includes(course.id))
        .filter((course) =>
            course.title.toLowerCase().includes(search.toLowerCase()),
        );

    const handleCheckboxChange = (courseId) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId)
                ? prev.filter((id) => id !== courseId)
                : [...prev, courseId],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCourses.length === 0) return;
        onEnroll(selectedCourses);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Enroll {user.name} in Courses</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label>Search Courses</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.modalInput}
                            placeholder="Type to search..."
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Select Courses</label>
                        <div
                            style={{
                                maxHeight: 200,
                                overflowY: "auto",
                                border: "1px solid #eee",
                                borderRadius: 8,
                                padding: 8,
                            }}
                        >
                            {filteredCourses.length === 0 ? (
                                <div>No courses found.</div>
                            ) : (
                                filteredCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        style={{ marginBottom: 8 }}
                                    >
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={course.id}
                                                checked={selectedCourses.includes(
                                                    course.id,
                                                )}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        course.id,
                                                    )
                                                }
                                                disabled={loading}
                                            />{" "}
                                            {course.title}
                                        </label>
                                    </div>
                                ))
                            )}
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
                            disabled={loading || selectedCourses.length === 0}
                            className={styles.saveBtn}
                        >
                            {loading ? "Enrolling..." : "Enroll"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}