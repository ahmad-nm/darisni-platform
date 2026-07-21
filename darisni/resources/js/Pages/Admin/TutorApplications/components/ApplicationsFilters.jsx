import styles from "../TutorApplications.module.css";

export default function ApplicationsFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    showDuplicatesOnly,
    setShowDuplicatesOnly,
}) {
    return (
            <div className={styles.filtersContainer}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search by name, email, or university..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.statusFilter}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="under_review">Under Review</option>
                    </select>

                    <label className={styles.duplicateFilterLabel}>
                        <input
                            type="checkbox"
                            checked={showDuplicatesOnly}
                            onChange={(e) =>
                                setShowDuplicatesOnly(e.target.checked)
                            }
                            className={styles.duplicateFilterCheckbox}
                        />
                        Show only duplicate applications
                    </label>
                </div>
            </div>
    );
}
