import { Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import style from './Introduction.module.css';

export function Intro() {
    const { auth } = usePage().props;

    return (
        <div className={style.IntroContainer}>
            <h1 className={style.Title}>Online Education <br /> Academy</h1>
            <p className={style.Description}>Your one-stop solution for all your needs.</p>
            <div className={style.IntroBtns}>
                {!auth?.user && (
                    <Link className={style.GetStarted} href="/register">Get Started</Link>
                )}
                <Link className={style.LearnMore} href="/docs">Learn More</Link>
            </div>
        </div>
    );
}