import { useState, useEffect } from 'react';
import { Loader } from '../../Components/Loader/Loader';
import { Navbar } from '../../Components/navBar/nav.jsx';
import { TutorCard } from '../../Components/TutorCard/TutorCard';
import { About } from '../AboutPage/components/About/About.jsx';
import { TutorCard } from './Components/TutorCard/TutorCard';
import { About } from '../../Components/About/About.jsx';
import style from './Tutors.module.css';

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const minLoadTime = 1500;
        const start = Date.now();

        // Fetch tutors data from API
        const fetchTutors = async () => {
            try {
                const response = await fetch('/api/tutors');
                const data = await response.json();
                
                if (data.success) {
                    setTutors(data.data);
                } else {
                    // Fallback to empty array if API fails
                    setTutors([]);
                }
            } catch (error) {
                console.error('Error fetching tutors:', error);
                // Fallback to empty array on error
                setTutors([]);
            }
        };

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = minLoadTime - elapsed;
            if (remaining > 0) {
                setTimeout(() => setIsLoading(false), remaining);
            } else {
                setIsLoading(false);
            }
        };

        // Fetch tutors first
        fetchTutors().then(() => {
            if (document.readyState === "complete") {
                handleLoad();
            } else {
                window.addEventListener("load", handleLoad);
            }
        });

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    return (
        <div className={style.TutorsContainer}>
            {isLoading ? (
                <div className={style.loaderWrapper}>
                    <Loader />
                </div>
            ) : (
                <>
                    <Navbar />

                    <div className={style.tutorsContent}>
                        <h1>Our Tutors</h1>
                        <div className={style.tutorsList}>
                            {tutors.map(tutor => (
                                <TutorCard key={tutor.id} tutor={tutor} />
                            ))}
                        </div>
                    </div>
                    
                    <About />
                </>
            )}
        </div>
    );
}