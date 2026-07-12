import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Loader } from '../../Components/Loader/Loader';
import { TutorInfoContent } from '../../Components/TutorInfoContent/TutorInfoContent';
import style from './TutorInfo.module.css';

export default function TutorInfo({ tutorId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [tutor, setTutor] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const minLoadTime = 1000;
        const start = Date.now();

        const fetchTutor = async () => {
            try {
                const response = await fetch(`/api/tutors/${tutorId}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setTutor(data.data);
                } else {
                    setError('Tutor not found');
                }
            } catch (error) {
                console.error('Error fetching tutor:', error);
                setError('Failed to load tutor information');
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

        fetchTutor().then(() => {
            if (document.readyState === "complete") {
                handleLoad();
            } else {
                window.addEventListener("load", handleLoad);
            }
        });

        return () => window.removeEventListener("load", handleLoad);
    }, [tutorId]);

    if (error) {
        return (
            <div className={style.TutorInfoContainer}>
                <div className={style.errorContainer}>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button 
                        className={style.backButton}
                        onClick={() => router.visit('/tutors')}
                    >
                        Back to Tutors
                    </button>
                </div>
            </div>
        );
    }

    if (!tutor && !isLoading) {
        return (
            <div className={style.TutorInfoContainer}>
                <div className={style.errorContainer}>
                    <h2>Tutor Not Found</h2>
                    <p>The tutor you're looking for doesn't exist.</p>
                    <button 
                        className={style.backButton}
                        onClick={() => router.visit('/tutors')}
                    >
                        Back to Tutors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={style.TutorInfoContainer}>
            {isLoading ? 
                <div className={style.loaderWrapper}>
                    <Loader />
                </div> 

                : (

                <div className={style.TutorInfoBody}>
                    <TutorInfoContent tutor={tutor} />
                </div>
            )}
        </div>
    );
}