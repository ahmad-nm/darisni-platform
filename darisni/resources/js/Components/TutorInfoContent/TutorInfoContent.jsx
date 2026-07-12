import { TutorProfile } from './TutorProfile';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { RatingModal } from '../RatingModal/RatingModal';
import style from './TutorInfoContent.module.css';

export function TutorInfoContent({ tutor }) {
    const [showRatingModal, setShowRatingModal] = useState(false);

    const handleWhatsApp = () => {
        const tutorName = tutor?.name || tutor?.user?.name || 'this tutor';
        const message = `Hi! I'm interested in booking a session with ${tutorName}`;
        
        // Use tutor's contact if available, otherwise fallback to default
        const contactNumber = tutor?.contact || '787895366'; // Default contact number
        window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleEmail = () => {
        const tutorName = tutor?.name || tutor?.user?.name || 'Tutor';
        window.open(`mailto:info@darisni.net?subject=Booking Request for ${tutorName}`);
    };

    const handleBooking = () => {
        window.location.href = `https://wa.me/96178795366?text=Hi!%20I%27m%20interested%20in%20booking%20a%20session%20with%20the%20tutor%20${tutorName}.`;
    };

    const handleRatingSubmitted = () => {
        // You can add any logic here to refresh tutor data or show a success message
        console.log('Rating submitted successfully!');
    };

    // Format the courses from the database relationship
    const formatCourses = (courses) => {
        if (!courses || !Array.isArray(courses)) return [];
        return courses.map(course => course.title || course.name || 'Untitled Course');
    };

    // Format availability
    const formatAvailability = (availability) => {
        if (!availability || !Array.isArray(availability)) return [];
        return availability.map(slot => ({
            day: slot.day_of_week || slot.day || 'Unknown',
            time: `${slot.start_time || ''} - ${slot.end_time || ''}`.trim() || slot.time || 'Time TBD'
        }));
    };

    const tutorName = tutor?.name || tutor?.user?.name || 'Unknown Tutor';
    const tutorUniversity = tutor?.university || 'University not specified';
    const tutorYear = tutor?.year ? `Year ${tutor.year}` : '';
    const tutorBio = tutor?.bio || 'No bio available.';
    const joinedDate = tutor?.created_at || tutor?.joinedDate;
    const courses = formatCourses(tutor?.courses);
    const availability = formatAvailability(tutor?.availability);

    return (
        <div className={style.tutorInfoContent}>
            <div className={style.tutorInfoContainer}>
                <div className={style.tutorDetails}>
                    <div className={style.tutorDetailsHeader}>
                        <div className={style.backButton}>
                            <button onClick={() => router.visit('/tutors')}>
                                ← Back to Tutors
                            </button>
                        </div>
                        
                        <div className={style.tutorDetailsHeaderDetails}>
                            <h2>{tutorName}</h2>
                            <p>{tutorYear} {tutorYear && tutorUniversity && '•'} {tutorUniversity}</p>
                        </div>
                    </div>

                    <div className={style.tutorProfileContainer}>
                        <TutorProfile tutor={tutor} />
                    </div>

                    <div className={style.tutorDetailsBody}>
                        <div className={style.paddingDiv}>
                            {/* Basic Info */}
                            <div className={style.joinedDateContainer}>
                                <div className={style.joinedDate}>
                                    <span className={style.icon}>📅</span>
                                    <span>Joined: {joinedDate ? new Date(joinedDate).toLocaleDateString() : 'Unknown'}</span>
                                </div>
                            </div>

                            {/* Tutor Bio */}
                            <div className={style.bioSection}>
                                <h3 className={style.sectionTitle}>About {tutorName}</h3>
                                <p className={style.bioText}>{tutorBio}</p>
                            </div>

                            {/* Stats
                            <div className={style.tutorStats}>
                                <div className={style.statCard}>
                                    <span className={style.statNumber}>{tutor?.experience_years || 0}</span>
                                    <span className={style.statLabel}>Years Experience</span>
                                </div>
                                <div className={style.statCard}>
                                    <span className={style.statNumber}>{courses.length}</span>
                                    <span className={style.statLabel}>Courses</span>
                                </div>
                                <div className={style.statCard}>
                                    <span className={style.statNumber}>
                                        {tutor?.average_rating && typeof tutor.average_rating === 'number' 
                                            ? tutor.average_rating.toFixed(1) 
                                            : '0.0'}/5
                                    </span>
                                    <span className={style.statLabel}>Rating</span>
                                </div>
                                <div className={style.statCard}>
                                    <span className={style.statNumber}>{tutor?.total_reviews || 0}</span>
                                    <span className={style.statLabel}>Reviews</span>
                                </div>
                            </div> */}
                        </div>
                        
                        
                        <div className={style.noPadding}>
                            {/* Courses */}
                            <div className={style.coursesSection}>
                                <h3 className={style.sectionTitle}>Courses Taught</h3>
                                <div className={style.coursesGrid}>
                                    {courses.length > 0 ? (
                                        courses.map((course, index) => (
                                            <div key={index} className={style.courseCard}>
                                                <span className={style.courseName}>{course}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No courses assigned yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className={style.availabilitySection}>
                                <h3 className={style.sectionTitle}>Availability</h3>
                                <div className={style.availabilityGrid}>
                                    {availability.length > 0 ? (
                                        availability.map((slot, index) => (
                                            <div key={index} className={style.availabilityCard}>
                                                <div className={style.dayName}>{slot.day}</div>
                                                <div className={style.timeSlot}>
                                                    {slot.time}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No availability set yet. Contact tutor for scheduling.</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className={style.contactSection}>
                                <h3 className={style.sectionTitle}>Get in Touch</h3>
                                <p>Ready to start learning? Contact {tutorName} to book your session!</p>
                                <div className={style.contactButtons}>
                                    <button className={`${style.contactBtn} ${style.emailBtn}`} onClick={handleEmail}>
                                        📧 Email
                                    </button>
                                    <button className={`${style.contactBtn} ${style.bookBtn}`} onClick={handleBooking}>
                                        📚 Book Session
                                    </button>
                                    <button 
                                        className={`${style.contactBtn} ${style.rateBtn}`} 
                                        onClick={() => setShowRatingModal(true)}
                                    >
                                        ⭐ Rate Tutor
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                type="tutor"
                subject={tutor}
                onRatingSubmitted={handleRatingSubmitted}
            />
        </div>
    );
}