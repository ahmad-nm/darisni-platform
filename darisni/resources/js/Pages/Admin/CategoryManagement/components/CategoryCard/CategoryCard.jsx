import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category, onView, onEdit, onDelete }) {
    return (
        <div
            key={category.id}
            className={`${styles.categoryCard} ${!category.visible ? styles.nonVisible : ""}`}
        >
            {!category.visible && (
                <div className={styles.nonVisibleBadge}>Not Visible</div>
            )}

            <div className={styles.categoryHeader}>
                <div className={styles.categoryId}>#{category.id}</div>
                <div className={styles.categoryActions}>
                    <button
                        className={styles.actionBtn}
                        onClick={() => onView(category)}
                        title="View Details"
                    >
                        👁️
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={() => onEdit(category)}
                        title="Edit Category"
                    >
                        ✏️
                    </button>
                    <button
                        className={styles.actionBtn}
                        onClick={() => onDelete(category.id)}
                        title="Delete Category"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className={styles.categoryImage}>
                {category.image ? (
                    <img src={category.image} alt={category.name} />
                ) : (
                    <div className={styles.placeholderImage}>📂</div>
                )}
            </div>

            <div className={styles.categoryContent}>
                <h3 className={styles.categoryName}>{category.name}</h3>
                <p className={styles.categoryDescription}>
                    {category.description || "No description provided"}
                </p>

                <div className={styles.categoryStats}>
                    <span className={styles.coursesCount}>
                        📚 {category.courses_count || 0} courses
                    </span>
                    <span className={styles.categoryDate}>
                        Created:{" "}
                        {new Date(category.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
