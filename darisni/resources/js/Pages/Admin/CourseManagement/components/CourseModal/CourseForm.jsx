import styles from "../../CourseManagement.module.css";

export default function CourseForm({
    formData,
    setFormData,
    categories,
    tutors,
    loading,
    uploading,
    mode,
    onClose,
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
}) {

    return (
        <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Course Code *</label>
                    <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                code: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Title *</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        required
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Category *</label>
                    <select
                        value={formData.category_id}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                category_id: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Tutor *</label>
                    <select
                        value={formData.tutor_id}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                tutor_id: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                        required
                    >
                        <option value="">Select Tutor</option>
                        {tutors.map((tutor) => (
                            <option key={tutor.id} value={tutor.id}>
                                {tutor.user ? tutor.user.name : tutor.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Subject</label>
                    <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                subject: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                price: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Lectures</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.lectures}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                lectures: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Credits</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.credits}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                credits: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Semester</label>
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.semester}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                semester: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Duration (weeks)</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.duration_weeks}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                duration_weeks: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Type</label>
                    <input
                        type="text"
                        value={formData.type}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                type: e.target.value,
                            }))
                        }
                        className={styles.modalInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Course Image</label>
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
                                alt="Course"
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

                <div className={styles.formGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={formData.visible}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    visible: e.target.checked,
                                }))
                            }
                            className={styles.modalCheckbox}
                        />
                        Visible
                    </label>
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
                          ? "Create Course"
                          : "Save Changes"}
                </button>
            </div>
        </form>
    );
}