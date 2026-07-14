import { useState, useEffect } from 'react';
import { Loader } from '@/Components/Loader/Loader';
import { Navbar } from '@/Components/navBar/nav.jsx';
import { About } from '../AboutPage/components/About/About.jsx';
import { TutorCard } from './Components/TutorCard/TutorCard';
import style from './Tutors.module.css';
import { fetchTutors } from '@/services/tutorService.js';

export default function Tutors() {
    const [tutors, setTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const minLoadTime = 1500;
        const start = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = minLoadTime - elapsed;
            if (remaining > 0) {
                setTimeout(() => setIsLoading(false), remaining);
            } else {
                setIsLoading(false);
            }
        };

        const fetchTutorsData = async () => {
            const tutorsData = await fetchTutors();
            setTutors(tutorsData);
        };

        // Fetch tutors first
        fetchTutorsData().then(() => {
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