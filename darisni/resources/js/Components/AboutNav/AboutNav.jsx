import { useState } from 'react';
// import Logo from '../../assets/logo.png';
import style from './AboutNav.module.css';

export function AboutNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const smoothScrollTo = (targetId) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const startPosition = window.pageYOffset;
        const targetPosition = targetElement.offsetTop - 100;
        const distance = targetPosition - startPosition;
        const duration = 1200;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            const run = startPosition + distance * easeInOutCubic;
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        smoothScrollTo(sectionId);
        window.history.replaceState(null, '', `#${sectionId}`);
        // Close mobile menu after clicking
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={style.AboutNavContainer}>
            <div className={style.Logo} onClick={() => window.location.href = "/"}>
                {/* <img src={Logo} alt="Logo" /> */}
                <h1 className={style.LogoText}>Darisni</h1>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className={style.MobileMenuButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
            >
                <span className={`${style.hamburger} ${isMobileMenuOpen ? style.open : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            {/* Navigation Menu */}
            <ul className={`${style.AboutNavList} ${isMobileMenuOpen ? style.mobileOpen : ''}`}>
                <li className={style.AboutNavItem}>
                    <a 
                        href="#aboutus" 
                        className={style.AboutNavLink}
                        onClick={(e) => handleNavClick(e, 'aboutus')}
                    >
                        About Us
                    </a>
                </li>
                
                <li className={style.AboutNavItem}>
                    <a 
                        href="#mission" 
                        className={style.AboutNavLink}
                        onClick={(e) => handleNavClick(e, 'mission')}
                    >
                        Our Mission
                    </a>
                </li>
                
                <li className={style.AboutNavItem}>
                    <a 
                        href="#vision" 
                        className={style.AboutNavLink}
                        onClick={(e) => handleNavClick(e, 'vision')}
                    >
                        Our Vision
                    </a>
                </li>
                
                <li className={style.AboutNavItem}>
                    <a 
                        href="#team" 
                        className={style.AboutNavLink}
                        onClick={(e) => handleNavClick(e, 'team')}
                    >
                        Meet the Team
                    </a>
                </li>
                
                <li className={style.AboutNavItem}>
                    <a 
                        href="#join" 
                        className={style.AboutNavLink}
                        onClick={(e) => handleNavClick(e, 'join')}
                    >
                        Join our Team
                    </a>
                </li>
            </ul>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className={style.mobileOverlay}
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
        </nav>
    )
}