import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import aboutusImage from '../../../../assets/Background/aboutus.jpeg';
import ourMissionImage from '../../../../assets/Background/ourMission.jpeg';
import ourVisionImage from '../../../../assets/Background/ourVision1.jpeg';
import ourTeamImage from '../../../../assets/Background/ourTeambg.jpg';
import joinUsImage from '../../../../assets/Background/JoinTeam.jpeg';
import style from './AboutContent.module.css';
import { ROUTES } from '@/constants/routes';

export function AboutContent() {

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                } else {
                    entry.target.style.opacity = '0.3';
                    entry.target.style.transform = 'translateY(40px)';
                }
            });
        }, observerOptions);
    
        const sections = document.querySelectorAll('[id^="aboutus"], [id^="mission"], [id^="vision"], [id^="team"], [id^="join"]');
        sections.forEach(section => {
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
    }, []);

    return (
        <div className={style.AboutContentContainer}>
            
            <div className={style.AboutSection} id="aboutus">
                <div className={style.AboutSectionContent}>
                    <h2>About Us</h2>
                    <h1>WHO WE ARE</h1>
                    <p>Darisni is a platform dedicated to connecting students with experienced tutors to enhance their learning experience.</p>
                </div>

                <div className={style.AboutSectionImage}>
                    <img src={aboutusImage} alt="About Us" />
                </div>
            </div>

            <div className={style.AboutSection} id="mission">
                <div className={style.AboutSectionImage}>
                    <img src={ourMissionImage} alt="Mission" />
                </div>

                <div className={style.AboutSectionContent}>
                    <h2>Our Mission</h2>
                    <h1>WHAT WE DO</h1>
                    <p>Our mission is to provide a platform that empowers students to achieve their academic goals through personalized tutoring and support.</p>
                </div>
            </div>

            <div className={style.AboutSection} id="vision">
                <div className={style.AboutSectionContent}>
                    <h2>Our Vision</h2>
                    <h1>WHERE WE ARE HEADING</h1>
                    <p>We envision a future where every student has access to the resources and support they need to succeed academically.</p>
                </div>

                <div className={style.AboutSectionImage}>
                    <img src={ourVisionImage} alt="Vision" />
                </div>
            </div>

            <div className={style.AboutSection} id="team">
                <div className={style.AboutSectionImage}>
                    <img src={ourTeamImage} alt="Team" />
                </div>

                <div className={style.AboutSectionContent}>
                    <h2>Our Team</h2>
                    <h1>MEET OUR TEAM</h1>
                    <p>Our team consists of dedicated professionals who are passionate about education and committed to helping students excel.</p>
                </div>
            </div>

            <div className={style.AboutSection} id="join">
                <div className={style.AboutSectionContent}>
                    <h2>Join Us</h2>
                    <h1>BE PART OF OUR JOURNEY</h1>
                    <p>We are always looking for passionate individuals to join our team and help us make a difference in the education sector.</p>
                    <Link href={ROUTES.JOIN_TEAM} className={style.JoinLink}>Join Our Team</Link>
                </div>

                <div className={style.AboutSectionImage}>
                    <img src={joinUsImage} alt="Join Us" />
                </div>
            </div>

        </div>
    );
}