import styles from "./Pagination.module.css";


export default function Pagination({
    currentPage,
    totalPages,
    setCurrentPage,
}) {

    if (totalPages <= 1) {
        return null;
    }


    return (
        <div className={styles.pagination}>

            <button
                className={styles.pageBtn}
                onClick={() =>
                    setCurrentPage((prev) =>
                        Math.max(prev - 1, 1)
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
                        className={`${styles.pageNumber} ${
                            currentPage === index + 1
                                ? styles.active
                                : ""
                        }`}
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
                        Math.min(prev + 1, totalPages)
                    )
                }
                disabled={currentPage === totalPages}
            >
                Next
            </button>

        </div>
    );
}