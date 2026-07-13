import { AboutNav } from './components/AboutNav/AboutNav';
import { AboutContent } from './components/AboutContent/AboutContent';
import { About } from './components/About/About';
import style from './AboutPage.module.css';

export default function AboutPage() {
    return (
        <div className={style.AboutPageContainer}>
            <div className={style.AboutNav}>
                <AboutNav />
            </div>

            <div className={style.AboutContent}>
                <AboutContent />
            </div>

            <About />
        </div>
    )
}