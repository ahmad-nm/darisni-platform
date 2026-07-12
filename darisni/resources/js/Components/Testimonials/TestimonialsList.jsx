import { useState, useEffect } from 'react';
import style from './TestimonialsList.module.css';
import { Testimonials } from './TestimonialItem.jsx'

export function TestimonialsList() {
    const [testimonialData, setTestimonialData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews/darisni?limit=6');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    // Transform the API data to match the expected format
                    const transformedData = data.data.map(review => ({
                        id: review.id,
                        name: review.user?.name || 'Anonymous',
                        rating: review.rating,
                        testimonial: review.feedback || '', // Map feedback to testimonial
                        image: review.user?.image || '/images/default-avatar.svg', // Use default avatar
                        major: review.user?.role || 'Student', // Use role as major or default to Student
                        date: review.created_at
                    }));
                    setTestimonialData(transformedData);
                } else {
                    setTestimonialData([]);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                // Fallback to mock data on error
                setTestimonialData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
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