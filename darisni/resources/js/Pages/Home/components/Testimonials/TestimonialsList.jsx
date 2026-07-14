import { useState, useEffect } from 'react';
import style from './TestimonialsList.module.css';
import { Testimonials } from './TestimonialItem.jsx'
import { fetchReviews } from '../../../../services/testimonialService.js';

export function TestimonialsList() {
    const [testimonialData, setTestimonialData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const testimonials = await fetchReviews();
                setTestimonialData(testimonials);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
                setTestimonialData([]);
            } finally {
                setLoading(false);
            }
        };

        loadTestimonials();
    }, []);

    if (loading) {
        return (
            <div className={style.TestimonialsListContainer}>
                <h2 className={style.TestimonialsTitle}>Words From Our Students</h2>
                <div className={style.LoadingContainer}>
                    <p>Loading testimonials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={style.TestimonialsListContainer}>
            <h2 className={style.TestimonialsTitle}>Words From Our Students</h2>

            {testimonialData.length === 0 ? (
                <div className={style.NoReviews}>
                    <p>No reviews yet.</p>
                </div>
            ) : (
                <div className={style.TestimonialsList}>
                    {testimonialData.map((testimonial) => (
                        <Testimonials 
                            Testimonial={testimonial} 
                            key={testimonial.id} 
                        />
                    ))}
                </div>
            )}

            {/* Scroll indicator for mobile */}
            <div className={style.ScrollIndicator}>
                Swipe to see more testimonials →
            </div>
        </div>
    );
}