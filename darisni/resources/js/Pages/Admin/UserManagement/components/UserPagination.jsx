import React from "react";
import styles from "../UserManagement.module.css";

export default function UserPagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <div className={styles.pageNumbers}>
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;

                    return (
                        <button
                            key={pageNumber}
                            className={`${styles.pageNumber} ${
                                currentPage === pageNumber ? styles.active : ""
                            }`}
                            onClick={() => onPageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>

            <button
                className={styles.pageBtn}
                onClick={() =>
                    onPageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}
