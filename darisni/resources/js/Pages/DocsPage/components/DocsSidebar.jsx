import style from '../Docs.module.css';

export default function DocsSidebar({
    sections,
    activeSection,
    scrollToSection
}) {
    return(
        <div className={style.sidebar}>
                    <nav className={style.navigation}>
                        <h3 className={style.navTitle}>Quick Navigation</h3>
                        <ul className={style.navList}>
                            {sections.map((section) => (
                                <li key={section.id} className={style.navItem}>
                                    <button
                                        className={`${style.navLink} ${activeSection === section.id ? style.active : ''}`}
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        <span className={style.navIcon}>{section.icon}</span>
                                        {section.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Quick Links */}
                    <div className={style.quickLinks}>
                        <h4 className={style.quickLinksTitle}>Quick Links</h4>
                        <div className={style.linksList}>
                            <a href="/signup" className={style.quickLink}>
                                <span>👤</span> Sign Up
                            </a>
                            <a href="/tutors" className={style.quickLink}>
                                <span>👨‍🏫</span> Find Tutors
                            </a>
                            <a href="mailto:info@darisni.net" className={style.quickLink}>
                                <span>📞</span> Contact Support
                            </a>
                        </div>
                    </div>
                </div>
    );
}