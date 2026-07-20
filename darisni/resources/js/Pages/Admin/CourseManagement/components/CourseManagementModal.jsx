import { useEffect, useState } from "react";
import styles from '../CourseManagement.module.css';

// Chapter Management Modal Component
export default function ChapterManagementModal({
    course,
    onClose,
    getCourseChapters,
    createCourseChapter,
    updateCourseChapter,
    deleteCourseChapter,
}) {
    const [chapters, setChapters] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [chapterContent, setChapterContent] = useState("");

    useEffect(() => {
        fetchChapters();
    }, [course.id]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            const response = await getCourseChapters(course.id);
            setChapters(response || []);
        } catch (error) {
            console.error("Error fetching chapters:", error);
            setChapters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddChapter = () => {
        setEditingChapter(null);
        setChapterContent("");
        setShowChapterForm(true);
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setChapterContent(chapter.content);
        setShowChapterForm(true);
    };

    const handleSaveChapter = async (e) => {
        e.preventDefault();
        if (!chapterContent.trim()) return;

        try {
            if (editingChapter) {
                // Update existing chapter
                const updatedChapter = await updateCourseChapter(
                    editingChapter.id,
                    {
                        course_id: course.id,
                        content: chapterContent,
                    },
                );
                setChapters((prev) =>
                    prev.map((ch) =>
                        ch.id === editingChapter.id ? updatedChapter : ch,
                    ),
                );
            } else {
                // Create new chapter
                const newChapter = await createCourseChapter({
                    course_id: course.id,
                    content: chapterContent,
                });
                setChapters((prev) => [...prev, newChapter]);
            }

            setShowChapterForm(false);
            setChapterContent("");
            setEditingChapter(null);
        } catch (error) {
            console.error("Error saving chapter:", error);
            alert("Failed to save chapter. Please try again.");
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (!window.confirm("Are you sure you want to delete this chapter?"))
            return;

        try {
            await deleteCourseChapter(chapterId);
            setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
        } catch (error) {
            console.error("Error deleting chapter:", error);
            alert("Failed to delete chapter. Please try again.");
        }
    };

    const handleCancelForm = () => {
        setShowChapterForm(false);
        setChapterContent("");
        setEditingChapter(null);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.chapterModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h2>Manage Chapters - {course.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.chapterModalContent}>
                    <div className={styles.chapterHeader}>
                        <h3>Course Chapters ({chapters.length})</h3>
                        <button
                            className={styles.addChapterBtn}
                            onClick={handleAddChapter}
                        >
                            + Add Chapter
                        </button>
                    </div>

                    {showChapterForm && (
                        <div className={styles.chapterForm}>
                            <h4>
                                {editingChapter
                                    ? "Edit Chapter"
                                    : "Add New Chapter"}
                            </h4>
                            <form onSubmit={handleSaveChapter}>
                                <div className={styles.formGroup}>
                                    <label>Chapter Content</label>
                                    <textarea
                                        value={chapterContent}
                                        onChange={(e) =>
                                            setChapterContent(e.target.value)
                                        }
                                        className={styles.chapterTextarea}
                                        placeholder="Enter chapter content, title, or description..."
                                        required
                                        rows={4}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <button
                                        type="button"
                                        onClick={handleCancelForm}
                                        className={styles.cancelBtn}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.saveBtn}
                                    >
                                        {editingChapter
                                            ? "Update Chapter"
                                            : "Add Chapter"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={styles.chaptersList}>
                        {loading ? (
                            <div className={styles.loadingMessage}>
                                Loading chapters...
                            </div>
                        ) : chapters.length === 0 ? (
                            <div className={styles.noChapters}>
                                <p>No chapters found for this course.</p>
                                <p>
                                    Click "Add Chapter" to create the first
                                    chapter.
                                </p>
                            </div>
                        ) : (
                            Array.isArray(chapters) &&
                            chapters.map((chapter, index) => (
                                <div
                                    key={chapter.id}
                                    className={styles.chapterItem}
                                >
                                    <div className={styles.chapterNumber}>
                                        Chapter {index + 1}
                                    </div>
                                    <div className={styles.chapterContent}>
                                        <p>
                                            {chapter.content ||
                                                "No content available"}
                                        </p>
                                        <div className={styles.chapterMeta}>
                                            <span>
                                                Created:{" "}
                                                {chapter.created_at
                                                    ? new Date(
                                                          chapter.created_at,
                                                      ).toLocaleDateString()
                                                    : "Unknown"}
                                            </span>
                                            {chapter.updated_at &&
                                                chapter.updated_at !==
                                                    chapter.created_at && (
                                                    <span>
                                                        Updated:{" "}
                                                        {new Date(
                                                            chapter.updated_at,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className={styles.chapterActions}>
                                        <button
                                            onClick={() =>
                                                handleEditChapter(chapter)
                                            }
                                            className={styles.editChapterBtn}
                                            title="Edit Chapter"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteChapter(chapter.id)
                                            }
                                            className={styles.deleteChapterBtn}
                                            title="Delete Chapter"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}