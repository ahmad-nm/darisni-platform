import { AboutNav } from '../../Components/AboutNav/AboutNav';
import { AboutContent } from '../../Components/AboutContent/AboutContent';
import { About } from '../../Components/About/About';
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