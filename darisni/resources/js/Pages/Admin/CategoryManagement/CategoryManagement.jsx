import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import styles from "./CategoryManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";

// API functions
const createCourseCategory = async (data) => {
    try {
        const response = await fetch("/admin/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.category;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

const updateCourseCategory = async (id, data) => {
    try {
        const response = await fetch(`/admin/categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.category;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

const deleteCourseCategory = async (id) => {
    try {
        const response = await fetch(`/admin/categories/${id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || `HTTP error! status: ${response.status}`,
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

export default function CategoryManagement({
    categories: initialCategories,
    stats: initialStats,
}) {
    const [categories, setCategories] = useState(initialCategories || []);
    const [filteredCategories, setFilteredCategories] = useState(
        initialCategories || [],
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'
    const [stats, setStats] = useState(initialStats || {});
    const categoriesPerPage = 12;

    // Update data when props change
    useEffect(() => {
        if (initialCategories && initialCategories.length >= 0) {
            setCategories(initialCategories);
            setFilteredCategories(initialCategories);
        }
        if (initialStats) setStats(initialStats);
    }, [initialCategories, initialStats]);

    // Filter categories based on search
    useEffect(() => {
        let filtered = categories;

        if (searchQuery) {
            filtered = filtered.filter(
                (category) =>
                    category.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (category.description &&
                        category.description
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())),
            );
        }

        if (visibilityFilter === "visible") {
            filtered = filtered.filter((category) => category.visible);
        } else if (visibilityFilter === "hidden") {
            filtered = filtered.filter((category) => !category.visible);
        }

        setFilteredCategories(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, categories, visibilityFilter]);

    // Pagination
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(
        indexOfFirstCategory,
        indexOfLastCategory,
    );
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDeleteCategory = async (categoryId) => {
        setSelectedCategory(
            categories.find((category) => category.id === categoryId),
        );
        setShowDeleteModal(true);
    };

    const confirmDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await deleteCourseCategory(selectedCategory.id);

            // Refresh the page to show updated data
            window.location.reload();
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Failed to delete category. Please try again.");
        }
    };

    const handleViewCategory = (category) => {
        setSelectedCategory(category);
        setModalMode("view");
        setShowCategoryModal(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setModalMode("edit");
        setShowCategoryModal(true);
    };

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setModalMode("create");
        setShowCategoryModal(true);
    };

    const handleSaveCategory = async (categoryData) => {
        try {
            if (modalMode === "create") {
                await createCourseCategory(categoryData);
            } else {
                await updateCourseCategory(selectedCategory.id, categoryData);
            }

            // Refresh the page to show updated data
            window.location.reload();
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Failed to save category. Please try again.");
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.pageContainer}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading categories...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <Head title="Category Management" />
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div>
                                <h1 className={styles.title}>
                                    Category Management
                                </h1>
                                <p className={styles.subtitle}>
                                    Manage course categories for your platform
                                </p>
                            </div>
                            <button
                                className={styles.addCategoryButton}
                                onClick={handleCreateCategory}
                            >
                                + Add New Category
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className={styles.filtersContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Search categories by name or description..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className={styles.searchInput}
                            />
                            <div className={styles.searchIcon}>🔍</div>
                        </div>

                        <div className={styles.filterContainer}>
                            <select
                                value={visibilityFilter}
                                onChange={(e) =>
                                    setVisibilityFilter(e.target.value)
                                }
                                className={styles.visibilityFilter}
                            >
                                <option value="all">All Visibility</option>
                                <option value="visible">Visible</option>
                                <option value="hidden">Not Visible</option>
                            </select>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredCategories.length}
                            </span>
                            <span className={styles.statLabel}>
                                Total Categories
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {filteredCategories.reduce(
                                    (total, cat) =>
                                        total + (cat.courses_count || 0),
                                    0,
                                )}
                            </span>
                            <span className={styles.statLabel}>
                                Total Courses
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {
                                    filteredCategories.filter(
                                        (cat) => cat.courses_count > 0,
                                    ).length
                                }
                            </span>
                            <span className={styles.statLabel}>
                                Active Categories
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {
                                    filteredCategories.filter(
                                        (cat) => !cat.courses_count,
                                    ).length
                                }
                            </span>
                            <span className={styles.statLabel}>
                                Empty Categories
                            </span>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className={styles.categoriesGrid}>
                        {currentCategories.map((category) => (
                            <div
                                key={category.id}
                                className={`${styles.categoryCard} ${!category.visible ? styles.nonVisible : ""}`}
                            >
                                {!category.visible && (
                                    <div className={styles.nonVisibleBadge}>
                                        Not Visible
                                    </div>
                                )}

                                <div className={styles.categoryHeader}>
                                    <div className={styles.categoryId}>
                                        #{category.id}
                                    </div>
                                    <div className={styles.categoryActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleViewCategory(category)
                                            }
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleEditCategory(category)
                                            }
                                            title="Edit Category"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() =>
                                                handleDeleteCategory(
                                                    category.id,
                                                )
                                            }
                                            title="Delete Category"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.categoryImage}>
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                        />
                                    ) : (
                                        <div
                                            className={styles.placeholderImage}
                                        >
                                            📂
                                        </div>
                                    )}
                                </div>

                                <div className={styles.categoryContent}>
                                    <h3 className={styles.categoryName}>
                                        {category.name}
                                    </h3>
                                    <p className={styles.categoryDescription}>
                                        {category.description ||
                                            "No description provided"}
                                    </p>

                                    <div className={styles.categoryStats}>
                                        <span className={styles.coursesCount}>
                                            📚 {category.courses_count || 0}{" "}
                                            courses
                                        </span>
                                        <span className={styles.categoryDate}>
                                            Created:{" "}
                                            {new Date(
                                                category.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>

                            <div className={styles.pageNumbers}>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.active : ""}`}
                                        onClick={() =>
                                            setCurrentPage(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className={styles.pageBtn}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages),
                                    )
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {filteredCategories.length === 0 && (
                        <div className={styles.noResults}>
                            <p>
                                No categories found matching your search
                                criteria.
                            </p>
                        </div>
                    )}
                </div>

                {/* Category Details/Edit Modal */}
                {showCategoryModal && (
                    <CategoryModal
                        category={selectedCategory}
                        mode={modalMode}
                        onClose={() => {
                            setShowCategoryModal(false);
                            setSelectedCategory(null);
                            setModalMode("view");
                        }}
                        onSave={handleSaveCategory}
                        setModalMode={setModalMode}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && selectedCategory && (
                    <DeleteConfirmationModal
                        category={selectedCategory}
                        onConfirm={confirmDeleteCategory}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedCategory(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}

// Category Details/Edit Modal Component
function CategoryModal({ category, mode, onClose, onSave, setModalMode }) {
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
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);

        try {
            const response = await fetch("/admin/categories/upload-image", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: formDataUpload,
            });
            const data = await response.json();
            if (data.url) {
                setFormData((prev) => ({ ...prev, image: data.url }));
            } else {
                alert("Failed to upload image.");
            }
        } catch (error) {
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

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ category, onConfirm, onCancel }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div
                className={styles.deleteModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.deleteModalHeader}>
                    <h2>Confirm Delete</h2>
                </div>

                <div className={styles.deleteModalContent}>
                    <p>Are you sure you want to delete this category?</p>
                    <div className={styles.categoryPreview}>
                        <strong>{category.name}</strong>
                        <br />
                        <span>{category.description || "No description"}</span>
                        <br />
                        <span>Courses: {category.courses_count || 0}</span>
                    </div>
                    <p className={styles.warning}>
                        This action cannot be undone and will affect associated
                        courses.
                    </p>
                </div>

                <div className={styles.deleteModalActions}>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={styles.deleteConfirmBtn}
                    >
                        {loading ? "Deleting..." : "Delete Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
