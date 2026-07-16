import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { router } from '@inertiajs/react';
import styles from './RatingModal.module.css';
import { submitRating } from '@/services/ratingService';

export function RatingModal({ isOpen, onClose, type, subject, onRatingSubmitted }) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleStarClick = (starRating) => {
        setRating(starRating);
    };

    const handleStarHover = (starRating) => {
        setHoveredRating(starRating);
    };

    const handleStarLeave = () => {
        setHoveredRating(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("Please log in to submit a rating");
            return;
        }

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await submitRating({
                type,
                subject_id: subject.id,
                rating,
                feedback: feedback.trim() || null,
            });

            setRating(0);
            setFeedback("");

            onRatingSubmitted?.();

            onClose();
        } catch (errors) {
            console.error(errors);

            setError(
                errors.message ||
                    "Failed to submit rating. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setRating(0);
            setHoveredRating(0);
            setFeedback('');
            setError('');
            onClose();
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'course': return '📚';
            case 'tutor': return '👨‍🏫';
            case 'darisni': return '🏢';
            default: return '⭐';
        }
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'course': return 'Course';
            case 'tutor': return 'Tutor';
            case 'darisni': return 'Platform';
            default: return 'Rating';
        }
    };

    const getRatingText = (stars) => {
        switch (stars) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return '';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerInfo}>
                        <span className={styles.typeIcon}>{getTypeIcon()}</span>
                        <div>
                            <h3>Rate {getTypeLabel()}</h3>
                            <p className={styles.subjectName}>{subject?.title || subject?.name}</p>
                        </div>
                    </div>
                    <button 
                        className={styles.closeBtn} 
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.ratingForm}>
                    <div className={styles.starsSection}>
                        <label className={styles.starsLabel}>Your Rating</label>
                        <div className={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`${styles.star} ${
                                        star <= (hoveredRating || rating) ? styles.starFilled : styles.starEmpty
                                    }`}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleStarLeave}
                                    disabled={isSubmitting}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        {(hoveredRating || rating) > 0 && (
                            <span className={styles.ratingText}>
                                {getRatingText(hoveredRating || rating)}
                            </span>
                        )}
                    </div>

                    <div className={styles.feedbackSection}>
                        <label htmlFor="feedback" className={styles.feedbackLabel}>
                            Share your experience (optional)
                        </label>
                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder={`Tell us about your experience with this ${type}...`}
                            className={styles.feedbackTextarea}
                            rows={4}
                            maxLength={500}
                            disabled={isSubmitting}
                        />
                        <div className={styles.charCount}>
                            {feedback.length}/500
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.modalActions}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.cancelBtn}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isSubmitting || rating === 0}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
