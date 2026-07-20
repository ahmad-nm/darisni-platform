import { useState } from 'react';
import styles from './CategoryModal.module.css';
import { uploadCategoryImage } from '@/services/admin/adCategoryService';

export default function CategoryModal({ category, mode, onClose, onSave, setModalMode }) {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        description: category?.description || "",
        image: category?.image || "",
        visible: category?.visible !== undefined ? category.visible : true,
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === "view") return;

        setLoading(true);
        try {
            await onSave(formData);
        } catch (error) {
            alert("Failed to save category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setUploading(true);

        try {
            const imageUrl = await uploadCategoryImage(file);

            setFormData((prev) => ({
                ...prev,
                image: imageUrl,
            }));
        } catch (error) {
            console.error(error);
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>
                        {mode === "view"
                            ? "Category Details"
                            : mode === "edit"
                              ? "Edit Category"
                              : "Create New Category"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                {mode === "view" ? (
                    <div className={styles.categoryDetailsView}>
                        <div className={styles.categoryImageSection}>
                            {category.image ? (
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className={styles.categoryImageLarge}
                                />
                            ) : (
                                <div className={styles.placeholderImageLarge}>
                                    📂
                                </div>
                            )}
                        </div>

                        <div className={styles.categoryInfoGrid}>
                            <div className={styles.infoItem}>
                                <label>Category ID</label>
                                <span>#{category.id}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Name</label>
                                <span>{category.name}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Description</label>
                                <span>
                                    {category.description ||
                                        "No description provided"}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Total Courses</label>
                                <span>{category.courses_count || 0}</span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Created</label>
                                <span>
                                    {new Date(
                                        category.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>

                            <div className={styles.infoItem}>
                                <label>Last Updated</label>
                                <span>
                                    {new Date(
                                        category.updated_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                onClick={onClose}
                                className={styles.cancelBtn}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => setModalMode("edit")}
                                className={styles.editFromViewBtn}
                            >
                                Edit Category
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        <div className={styles.formGroup}>
                            <label>Category Name *</label>
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
                                required
                                placeholder="Enter category name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className={styles.modalTextarea}
                                placeholder="Enter category description (optional)"
                                rows={4}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Category Image</label>
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
                                        style={{ maxWidth: 80, marginTop: 8 }}
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
                            <label>
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
                                      ? "Create Category"
                                      : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}