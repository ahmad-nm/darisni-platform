import { useState, useEffect, useRef } from "react";
import DocsHeader from "./components/DocsHeader";
import DocsSidebar from "./components/DocsSidebar";
import DocsContent from "./components/DocsContent";
import DocsFooter from "./components/DocsFooter";
import { DocsSections as sections } from "../../Constants/DocsSections";
import style from "./Docs.module.css";

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [searchTerm, setSearchTerm] = useState("");
    const observerRef = useRef(null);

    // Set up intersection observer for scroll-based section detection
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0% -70% 0%", // Trigger when section is 20% from top
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        observerRef.current = new IntersectionObserver(
            observerCallback,
            observerOptions,
        );

        // Observe all section elements
        const sectionElements = sections
            .map((section) => document.getElementById(section.id))
            .filter(Boolean);

        sectionElements.forEach((element) => {
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
            const sectionId = window.location.hash.replace("#", "");
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveSection(sectionId);
                }
            }, 200); // Delay to ensure DOM is ready
        }
    }, []);

    const filteredSections = sections.filter(
        (section) =>
            section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            section.content.some(
                (item) =>
                    item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            ),
    );

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className={style.docsPage}>
            {/* Header */}
            <DocsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className={style.docsContent}>
                {/* Sidebar Navigation */}
                <DocsSidebar
                    sections={sections}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />

                {/* Main Content */}
                <DocsContent
                    filteredSections={filteredSections}
                    activeSection={activeSection}
                    searchTerm={searchTerm}
                />
            </div>

            {/* Footer */}
            <DocsFooter />
        </div>
    );
}
