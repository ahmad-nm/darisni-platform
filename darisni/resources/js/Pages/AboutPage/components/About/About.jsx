import style from './About.module.css';
import CallIcon from '../../../../assets/Icons/call.png'
import EmailIcon from '../../../../assets/Icons/email.png';
import LocationIcon from '../../../../assets/Icons/location.png';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { RatingModal } from '../../../../Components/RatingModal/RatingModal';
import { ROUTES } from '@/constants/routes';

export function About() {
    const [showRatingModal, setShowRatingModal] = useState(false);

    const handleRatingSubmitted = () => {
        console.log('Platform rating submitted successfully!');
    };

    // Mock platform object for rating modal
    const platformInfo = {
        id: 1,
        title: 'Darisni Platform',
        name: 'Darisni'
    };
    return (
        <div className={style.AboutContainer}>
            <div className={style.Info}>
                <div className={style.CallUs}>
                    <div className={style.IconContainer}>
                        <img src={CallIcon} alt="Call Icon" className={style.Icon} />
                    </div>
                    
                    <div className={style.InfoDescription}>
                        <p className={style.InfoTitles}>Call us any time:</p>
                        <a href='https://wa.me/96178795366' className={style.InfoSubtitles}>+961 78 795 366</a>
                    </div>
                </div>

                <div className={style.EmailUs}>
                    <div className={style.IconContainer}>
                        <img src={EmailIcon} alt="Email Icon" className={style.Icon} />
                    </div>
                    
                    <div className={style.InfoDescription}>
                        <p className={style.InfoTitles}>Email Us:</p>
                        <div className={style.EmailsContainer}>
                            <a href='mailto:info@darisni.net' className={style.InfoSubtitles}>info@darisni.net /</a>
                            <a href='mailto:main@darisni.net' className={style.InfoSubtitles}> main@darisni.net</a>
                        </div>
                    </div>
                </div>
            
                <div className={style.Location}>
                    <div className={style.IconContainer}>
                        <img src={LocationIcon} alt="Location Icon" className={style.Icon} />
                    </div>
                    
                    <div className={style.InfoDescription}>
                        <p className={style.InfoTitles}>Location:</p>
                        <p className={style.InfoSubtitles}>Lebanon</p>
                    </div>
                </div>
            </div>
            
            <div className={style.AboutDetailsContainer}>
                <div className={style.AboutDetails}>
                    <div className={style.AboutText}>
                        <h2>About Us</h2>
                        <p>
                            Welcome to Darisni, your premium destination for online learning. 
                            We are dedicated to providing high-quality educational resources and courses 
                            that empower learners of all ages and backgrounds. Our mission is to make 
                            learning accessible, engaging, and effective through innovative technology and 
                            expert-led content.
                        </p>
                        <div className={style.rateSection}>
                            <p>Love our platform? Let us know!</p>
                            <button 
                                className={style.ratePlatformBtn}
                                onClick={() => setShowRatingModal(true)}
                            >
                                ⭐ Rate Darisni
                            </button>
                        </div>
                    </div>

                    <div className={style.Links}>
                        <div className={style.QuickLinks}>
                            <h3>Quick Links</h3>
                            <ul>
                                <li><Link href={ROUTES.HOME}>Home</Link></li>
                                <li><Link href={ROUTES.COURSE_CATEGORIES}>Courses</Link></li>
                                <li><Link href={ROUTES.TUTORS}>Tutors</Link></li>
                                <li><Link href={ROUTES.ABOUT}>About Us</Link></li>
                                <li><Link href={ROUTES.DOCS}>Documentation</Link></li>
                            </ul>
                        </div>

                        <div className={style.Resources}>
                            <h3>Resources</h3>
                            <ul>
                                <li><Link href={ROUTES.DOCS + '#faq'}>FAQ</Link></li>
                                <li><Link href={ROUTES.DOCS + '#support'}>Support</Link></li>
                            </ul>
                        </div>

                        <div className={style.SocialMedia}>
                            <h3>Follow Us On</h3>
                            <ul>
                                <li><Link href="https://www.facebook.com/share/18VpMLcGRe/">Facebook</Link></li>
                                <li><Link href="https://www.instagram.com/darisni.lb?igsh=czlkM3RqZGhneGc0">Instagram</Link></li>
                                <li><Link href="https://chat.whatsapp.com/CnRbR9uJLZ1B3mj9ukCEji">Whatsapp</Link></li>
                                <li><Link href="https://discord.gg/gfWmgYdF">Discord</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <hr className={style.Divider} />

                <div className={style.Footer}>
                    <p>&copy; {new Date().getFullYear()} Darisni. All rights reserved.</p>
                    <p>Designed with ❤️ by the Darisni Team</p>
                </div>
            </div>
            
            {/* Rating Modal */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                type="darisni"
                subject={platformInfo}
                onRatingSubmitted={handleRatingSubmitted}
            />
        </div>
    )
}