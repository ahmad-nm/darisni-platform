import style from '../Docs.module.css';

export default function DocsHeader({
    searchTerm,
    setSearchTerm
}) {
    return (
        <div className={style.docsHeader}>
            <button
                className={style.backButton}
                onClick={() => window.location.href = '/'}
            >
                ← Back to Home
            </button>

            <div className={style.headerContent}>
                <h1 className={style.docsTitle}>
                    📚 Darisni Documentation
                </h1>

                <p className={style.docsSubtitle}>
                    Everything you need to know about using our platform
                </p>

                <div className={style.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={style.searchInput}
                    />

                    <span className={style.searchIcon}>
                        🔍
                    </span>
                </div>
            </div>
        </div>
    );
}