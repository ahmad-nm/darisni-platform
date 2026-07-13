import style from '../Docs.module.css';

export default function DocsContent({
    filteredSections,
    activeSection,
    searchTerm
}) {
    return (
        <div className={style.mainContent}>
                    {filteredSections.map((section) => (
                        <section key={section.id} id={section.id} className={style.docSection}>
                            <div className={style.sectionHeader}>
                                <span className={`${style.sectionIcon} ${activeSection === section.id ? style.activeSectionIcon : ''}`}>{section.icon}</span>
                                <h2 className={style.sectionTitle}>{section.title}</h2>
                            </div>
                            
                            <div className={style.sectionContent}>
                                {section.content.map((item, index) => (
                                    <div key={index} className={style.contentItem}>
                                        <h3 className={style.itemTitle}>{item.title}</h3>
                                        <p className={style.itemContent}>{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* No Results */}
                    {filteredSections.length === 0 && searchTerm && (
                        <div className={style.noResults}>
                            <div className={style.noResultsIcon}>🔍</div>
                            <h3>No results found</h3>
                            <p>Try searching with different keywords or browse our sections above.</p>
                        </div>
                    )}
                </div>
    );
}