import styles from "../../TutorManagement.module.css";

export default function TutorDetails({ tutor, onClose, setModalMode, calculateAverageRating }) {
    return (
        <div className={styles.tutorDetailsView}>
            <div className={styles.tutorImageSection}>
                {tutor.image || tutor.user?.avatar ? (
                    <img
                        src={tutor.image || tutor.user?.avatar}
                        alt={tutor.name || tutor.user?.name}
                        className={styles.tutorImageLarge}
                    />
                ) : (
                    <div className={styles.placeholderImageLarge}>👨‍🏫</div>
                )}
            </div>

            <div className={styles.tutorInfoGrid}>
                <div className={styles.infoItem}>
                    <label>Tutor ID</label>
                    <span>#{tutor.id}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Name</label>
                    <span>{tutor.name || tutor.user?.name || "N/A"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Email</label>
                    <span>{tutor.user?.email || "N/A"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>University</label>
                    <span>{tutor.university || "Not specified"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Year</label>
                    <span>{tutor.year || "Not specified"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Experience</label>
                    <span>{tutor.experience_years || 0} years</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Hourly Rate</label>
                    <span>${tutor.hourly_rate || 0}/hour</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Contact</label>
                    <span>{tutor.contact || "Not provided"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Average Rating</label>
                    <span>
                        ⭐ {calculateAverageRating(tutor.ratings || [])} (
                        {(tutor.ratings || []).length} reviews)
                    </span>
                </div>

                <div className={styles.infoItem}>
                    <label>Total Courses</label>
                    <span>{tutor.courses?.length || 0}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Bio</label>
                    <span>{tutor.bio || "No bio provided"}</span>
                </div>

                <div className={styles.infoItem}>
                    <label>Created</label>
                    <span>
                        {new Date(tutor.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Availability Section */}
            {tutor.availability && tutor.availability.length > 0 && (
                <div className={styles.availabilitySection}>
                    <h3>Availability</h3>
                    <div className={styles.availabilityGrid}>
                        {tutor.availability.map((slot, index) => (
                            <div
                                key={index}
                                className={styles.availabilitySlot}
                            >
                                <span className={styles.availabilityDay}>
                                    {slot.day}
                                </span>
                                <span className={styles.availabilityTime}>
                                    {slot.start_time} - {slot.end_time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Courses Section */}
            {tutor.courses && tutor.courses.length > 0 && (
                <div className={styles.coursesSection}>
                    <h3>Courses ({tutor.courses.length})</h3>
                    <div className={styles.coursesGrid}>
                        {(tutor.courses || []).map((course, index) => (
                            <div key={index} className={styles.courseCard}>
                                <span className={styles.courseName}>
                                    {course.title || course.name}
                                </span>
                                <span className={styles.courseCode}>
                                    {course.code}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.modalActions}>
                <button onClick={onClose} className={styles.cancelBtn}>
                    Close
                </button>
                <button
                    onClick={() => setModalMode("edit")}
                    className={styles.editFromViewBtn}
                >
                    Edit Tutor
                </button>
            </div>
        </div>
    );
}
