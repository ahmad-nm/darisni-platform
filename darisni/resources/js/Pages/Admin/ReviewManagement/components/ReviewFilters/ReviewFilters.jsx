import styles from "./ReviewFilters.module.css";


export default function ReviewFilters({
    searchTerm,
    handleSearchChange,
    filter,
    handleFilterChange,
}) {
    return (
        <div className={styles.filtersContainer}>

            <div className={styles.searchContainer}>

                <input
                    type="text"
                    placeholder="Search reviews by user, course, or content..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />

                <div className={styles.searchIcon}>
                    🔍
                </div>

            </div>


            <div className={styles.filterContainer}>

                <div className={styles.filterButtons}>

                    <button
                        className={`${styles.filterBtn} ${
                            filter === "latest"
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterChange("latest")
                        }
                    >
                        📅 Latest
                    </button>


                    <button
                        className={`${styles.filterBtn} ${
                            filter === "course"
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterChange("course")
                        }
                    >
                        📚 Courses
                    </button>


                    <button
                        className={`${styles.filterBtn} ${
                            filter === "tutor"
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterChange("tutor")
                        }
                    >
                        👨‍🏫 Tutors
                    </button>


                    <button
                        className={`${styles.filterBtn} ${
                            filter === "darisni"
                                ? styles.active
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterChange("darisni")
                        }
                    >
                        🏢 Platform
                    </button>

                </div>

            </div>

        </div>
    );
}