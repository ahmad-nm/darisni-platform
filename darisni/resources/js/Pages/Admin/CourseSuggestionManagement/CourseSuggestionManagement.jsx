import React, { useState, useMemo } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import style from "./CourseSuggestionManagement.module.css";

export default function CourseSuggestionManagement({ suggestions = [] }) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [allSuggestions, setAllSuggestions] = useState(suggestions);

    // Stats
    const total = allSuggestions.length;
    const uniquePhones = useMemo(
        () => new Set(allSuggestions.map((s) => s.phone)).size,
        [allSuggestions],
    );

    // Filtered suggestions
    const filtered = useMemo(() => {
        if (!search) return allSuggestions;
        return allSuggestions.filter(
            (s) =>
                (s.user_name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (s.phone || "").toLowerCase().includes(search.toLowerCase()) ||
                (s.suggestion || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()),
        );
    }, [search, allSuggestions]);

    // Modal handlers
    const openModal = (suggestion) => {
        setSelected(suggestion);
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelected(null);
    };

    // Delete handler (AJAX)
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this suggestion?"))
            return;

        try {
            const res = await fetch(`/admin/course-suggestions/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                setAllSuggestions((prev) => prev.filter((s) => s.id !== id));
                if (selected && selected.id === id) closeModal();
            } else {
                alert("Failed to delete suggestion.");
            }
        } catch {
            alert("Failed to delete suggestion.");
        }
    };

    return (
        <AdminLayout>
            <div className={style.pageContainer}>
                <div className={style.container}>
                    {/* Header */}
                    <div className={style.header}>
                        <div className={style.headerContent}>
                            <div>
                                <h1 className={style.title}>
                                    Course Suggestions
                                </h1>
                                <p className={style.subtitle}>
                                    View and manage course suggestions submitted
                                    by users.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={style.statsContainer}>
                        <div className={style.statCard}>
                            <span className={style.statNumber}>{total}</span>
                            <span className={style.statLabel}>
                                Total Suggestions
                            </span>
                        </div>
                        <div className={style.statCard}>
                            <span className={style.statNumber}>
                                {uniquePhones}
                            </span>
                            <span className={style.statLabel}>
                                Unique Users
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className={style.filtersContainer}>
                        <div className={style.searchContainer}>
                            <input
                                type="text"
                                className={style.searchInput}
                                placeholder="Search by name, phone, or suggestion..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Suggestions Grid */}
                    {filtered.length === 0 ? (
                        <div className={style.emptyState}>
                            <div className={style.emptyIcon}>💡</div>
                            <h3>No Suggestions Found</h3>
                            <p>No course suggestions match your search.</p>
                        </div>
                    ) : (
                        <div className={style.suggestionsGrid}>
                            {filtered.map((s) => (
                                <div
                                    key={s.id}
                                    className={style.suggestionCard}
                                >
                                    <div className={style.cardHeader}>
                                        <span className={style.userName}>
                                            {s.user_name}
                                        </span>
                                        <span className={style.phone}>
                                            {s.phone}
                                        </span>
                                    </div>
                                    <div className={style.suggestionText}>
                                        {s.suggestion}
                                    </div>
                                    <div className={style.cardFooter}>
                                        <span className={style.date}>
                                            {new Date(
                                                s.created_at,
                                            ).toLocaleString()}
                                        </span>
                                        <button
                                            className={style.viewButton}
                                            onClick={() => openModal(s)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className={style.deleteButton}
                                            onClick={() => handleDelete(s.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {showModal && selected && (
                        <div
                            className={style.modalOverlay}
                            onClick={closeModal}
                        >
                            <div
                                className={style.modalContent}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={style.modalHeader}>
                                    <h2>Suggestion Details</h2>
                                    <button
                                        className={style.closeButton}
                                        onClick={closeModal}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className={style.modalBody}>
                                    <div>
                                        <strong>Name:</strong>{" "}
                                        {selected.user_name}
                                    </div>
                                    <div>
                                        <strong>Phone:</strong> {selected.phone}
                                    </div>
                                    <div>
                                        <strong>Suggestion:</strong>
                                    </div>
                                    <div
                                        style={{
                                            margin: "12px 0",
                                            whiteSpace: "pre-wrap",
                                        }}
                                    >
                                        {selected.suggestion}
                                    </div>
                                    <div>
                                        <strong>Submitted:</strong>{" "}
                                        {new Date(
                                            selected.created_at,
                                        ).toLocaleString()}
                                    </div>
                                </div>
                                <div className={style.modalActions}>
                                    <button
                                        className={style.deleteButton}
                                        onClick={() =>
                                            handleDelete(selected.id)
                                        }
                                    >
                                        🗑️ Delete
                                    </button>
                                    <button
                                        className={style.closeViewButton}
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
