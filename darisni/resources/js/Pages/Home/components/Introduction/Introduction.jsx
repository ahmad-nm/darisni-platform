import { Link } from '@inertiajs/react';
import style from './Introduction.module.css';
import { useAuth } from '@/contexts/AuthContext';

export function Intro() {
    const { user } = useAuth();

    return (
        <div className={style.IntroContainer}>
            <h1 className={style.Title}>Online Education <br /> Academy</h1>
            <p className={style.Description}>Your one-stop solution for all your needs.</p>
            <div className={style.IntroBtns}>
                {!user && (
                    <Link className={style.GetStarted} href="/register">Get Started</Link>
                )}
                <Link className={style.LearnMore} href="/docs">Learn More</Link>
            </div>
        </div>
    );
}