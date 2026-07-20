import styles from "../../TutorManagement.module.css";

export default function TutorForm({
    mode,
    handleSubmit,

    availableUsers,
    courses,

    formData,
    setFormData,

    availability,
    tutorCourses,

    handleAvailabilityAdd,
    handleAvailabilityChange,
    handleAvailabilityRemove,

    handleCourseAdd,
    handleCourseRemove,

    handleImageChange,
    handleRemoveImage,

    loading,
    uploading,

    onClose,
}) {
    return (
        <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                    <label>User Account *</label>
                    <select
                        value={formData.user_id}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                user_id: e.target.value,
                            }))
                        }
                        className={styles.modalSelect}
                        required
                        disabled={mode === "edit"}
                    >
                        <option value="">
                            {availableUsers.length === 0
                                ? "No users available (check admin permissions)"
                                : "Select a user"}
                        </option>
                        {availableUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.email})
                            </option>
                        ))}
                    </select>
                    {availableUsers.length === 0 && (
                        <small
                            style={{
                                color: "#ff6b7a",
                                fontSize: "0.8rem",
                                marginTop: "5px",
                                display: "block",
                            }}
                        >
                            Unable to load users. Please ensure you have admin
                            permissions and the backend is running.
                        </small>
                    )}
                </div>

                {availableUsers.length === 0 && (
                    <div className={styles.formGroup}>
                        <label>User ID (Manual Entry) *</label>
                        <input
                            type="number"
                            value={formData.user_id}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    user_id: e.target.value,
                                }))
                            }
                            className={styles.modalInput}
                            placeholder="Enter user ID manually"
                            required
                            min="1"
                        />
                        <small
                            style={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "0.8rem",
                                marginTop: "5px",
                                display: "block",
                            }}
                        >
                            Fallback: Enter the user ID number manually if user
                            list doesn't load.
                        </small>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Enter display name (optional)"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>University</label>
                    <input
                        type="text"
                        value={formData.university}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                university: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Enter university name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Year</label>
                    <input
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                year: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Enter academic year"
                        min="1"
                        max="10"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Experience (Years)</label>
                    <input
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                experience_years: parseInt(e.target.value) || 0,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Years of teaching experience"
                        min="0"
                        max="50"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Hourly Rate ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.hourly_rate}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                hourly_rate: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Enter hourly rate"
                        min="0"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Contact</label>
                    <input
                        type="text"
                        value={formData.contact}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                contact: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        placeholder="Enter contact information"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Profile Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.modalInput}
                        disabled={uploading}
                    />
                    {uploading && <span>Uploading...</span>}
                    {formData.image && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <img
                                src={formData.image}
                                alt="Category"
                                style={{
                                    maxWidth: 80,
                                    marginTop: 8,
                                }}
                            />

                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className={styles.removeImageBtn}
                                style={{
                                    marginLeft: 8,
                                    background: "#f44336",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 4,
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                    value={formData.bio}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                        }))
                    }
                    className={styles.modalTextarea}
                    placeholder="Enter tutor bio and qualifications"
                    rows={4}
                />
            </div>

            {/* Availability Management */}
            <div className={styles.availabilitySection}>
                <div className={styles.sectionHeader}>
                    <h3>Availability Schedule</h3>
                    <button
                        type="button"
                        onClick={handleAvailabilityAdd}
                        className={styles.addBtn}
                    >
                        + Add Time Slot
                    </button>
                </div>
                <div className={styles.availabilityGrid}>
                    {availability.map((slot, index) => (
                        <div key={index} className={styles.availabilitySlot}>
                            <select
                                value={slot.day || ""}
                                onChange={(e) =>
                                    handleAvailabilityChange(
                                        index,
                                        "day",
                                        e.target.value,
                                    )
                                }
                                className={styles.availabilityDay}
                            >
                                <option value="">Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                            <input
                                type="time"
                                value={slot.start_time || ""}
                                onChange={(e) =>
                                    handleAvailabilityChange(
                                        index,
                                        "start_time",
                                        e.target.value,
                                    )
                                }
                                className={styles.availabilityTime}
                            />
                            <span className={styles.timeSeparator}>to</span>
                            <input
                                type="time"
                                value={slot.end_time || ""}
                                onChange={(e) =>
                                    handleAvailabilityChange(
                                        index,
                                        "end_time",
                                        e.target.value,
                                    )
                                }
                                className={styles.availabilityTime}
                            />
                            <button
                                type="button"
                                onClick={() => handleAvailabilityRemove(index)}
                                className={styles.removeBtn}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {availability.length === 0 && (
                        <p className={styles.emptyMessage}>
                            No availability slots added
                        </p>
                    )}
                </div>
            </div>

            {/* Course Assignment */}
            <div className={styles.sectionGroup}>
                <div className={styles.sectionHeader}>
                    <h3>Assigned Courses</h3>
                    <select
                        onChange={handleCourseAdd}
                        className={styles.courseSelect}
                        value=""
                    >
                        <option value="">+ Assign Course</option>
                        {courses
                            .filter(
                                (course) =>
                                    !tutorCourses.some(
                                        (tc) => tc.id === course.id,
                                    ),
                            )
                            .map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title} ({course.code})
                                </option>
                            ))}
                    </select>
                </div>
                <div className={styles.coursesList}>
                    {tutorCourses.map((course, index) => (
                        <div
                            key={course.id || index}
                            className={styles.courseItem}
                        >
                            <span className={styles.courseTitle}>
                                {course.title || course.name}
                            </span>
                            <span className={styles.courseCode}>
                                {course.code}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCourseRemove(index)}
                                className={styles.removeBtn}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {tutorCourses.length === 0 && (
                        <p className={styles.emptyMessage}>
                            No courses assigned
                        </p>
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
                    disabled={loading}
                    className={styles.saveBtn}
                >
                    {loading
                        ? "Saving..."
                        : mode === "create"
                          ? "Create Tutor"
                          : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
