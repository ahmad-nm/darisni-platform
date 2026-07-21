import styles from "../TutorApplications.module.css";

export default function ApplicationPagination({
    currentPage,
    setCurrentPage,
    totalPages,
}) {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.pagination}>
            <button
                onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className={styles.paginationButton}
            >
                Previous
            </button>

            <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`${styles.pageNumber} ${
                                currentPage === pageNum ? styles.active : ""
                            }`}
                        >
                            {pageNum}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() =>
                    setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                    )
                }
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
            >
                Next
            </button>
        </div>
    );
}