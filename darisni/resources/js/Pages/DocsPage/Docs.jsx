import { useState, useEffect, useRef } from 'react';
import { DocsSections as sections } from '../../Objects/DocsSections';
import style from './Docs.module.css';

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchTerm, setSearchTerm] = useState('');
    const observerRef = useRef(null);

    // Set up intersection observer for scroll-based section detection
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0% -70% 0%', // Trigger when section is 20% from top
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all section elements
        const sectionElements = sections.map(section => 
            document.getElementById(section.id)
        ).filter(Boolean);

        sectionElements.forEach(element => {
            if (element) {
                observerRef.current.observe(element);
            }
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        // Scroll to section if URL has a hash (e.g. #faq)
        if (window.location.hash) {
            const sectionId = window.location.hash.replace('#', '');
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveSection(sectionId);
                }
            }, 200); // Delay to ensure DOM is ready
        }
    }, []);

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.some(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={style.docsPage}>
            {/* Header */}
            <div className={style.docsHeader}>
                <button className={style.backButton} onClick={() => window.location.href='/'}>
                    ← Back to Home
                </button>
                
                <div className={style.headerContent}>
                    <h1 className={style.docsTitle}>📚 Darisni Documentation</h1>
                    <p className={style.docsSubtitle}>
                        Everything you need to know about using our platform
                    </p>
                    
                    {/* Search Bar */}
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={style.searchInput}
                        />
                        <span className={style.searchIcon}>🔍</span>
                    </div>
                </div>
            </div>

            <div className={style.docsContent}>
                {/* Sidebar Navigation */}
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

                {/* Main Content */}
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
            </div>

            {/* Footer */}
            <div className={style.docsFooter}>
                <div className={style.footerContent}>
                    <div className={style.helpSection}>
                        <h3>Still need help?</h3>
                        <p>Our support team is here to assist you</p>
                        <div className={style.helpButtons}>
                            <button className={style.helpBtn} onClick={() => window.location.href='mailto:info@darisni.net'}>
                                📧 Email Support
                            </button>
                        </div>
                    </div>
                    
                    <div className={style.updateInfo}>
                        <p>📅 Last updated: {new Date().toLocaleDateString()}</p>
                        <p>Version 2.1.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}