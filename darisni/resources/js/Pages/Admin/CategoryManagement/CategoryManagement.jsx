import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import styles from "./CategoryManagement.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import { createCategory, deleteCategory, updateCategory } from "@/services/admin/adCategoryService";
import DeleteConfirmationModal from "./components/DeleteModal/DeleteModal";
import CategoryModal from "./components/CategoryModal/CategoryModal";
import CategoryCard from "./components/CategoryCard/CategoryCard";

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
            await deleteCategory(selectedCategory.id);

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
                await createCategory(categoryData);
            } else {
                await updateCategory(selectedCategory.id, categoryData);
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
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onView={handleViewCategory}
                                onEdit={handleEditCategory}
                                onDelete={handleDeleteCategory}
                            />
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