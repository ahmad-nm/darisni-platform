import { useState, useEffect } from 'react';
import style from './nav.module.css';
import { Link, router } from "@inertiajs/react";
import { route } from 'ziggy-js';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/authService';
import { ROUTES } from '@/constants/routes';
import { navigate } from '@/utils/navigationService';

export function Navbar(){
    const { user, setUser } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            logout({
                onSuccess: () => {
                    setUser(null);
                    navigate(ROUTES.HOME);
                },
                onError: (error) => {
                    console.error('Logout failed:', error);
                },
            });
        } catch (error) {
            console.error('An unexpected error occurred during logout:', error);
        }
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isMobileMenuOpen]);

    return(
        <nav className={style.nav}>
            <div className={style.nameLogo} onClick={() => window.location.href = "/"}>
                {/* <img src={logo} alt="Logo" /> */}
                <h1>Darisni</h1>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className={style.mobileMenuButton}
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
            >
                <span className={`${style.hamburger} ${isMobileMenuOpen ? style.open : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            {/* Navigation Links */}
            <ul className={`${style.links} ${isMobileMenuOpen ? style.mobileOpen : ''}`}>
                <li><Link href={ROUTES.HOME} onClick={closeMobileMenu}>Home</Link></li>
                <li><Link href={ROUTES.COURSE_CATEGORIES} onClick={closeMobileMenu}>Courses</Link></li>
                <li><Link href={ROUTES.TUTORS} onClick={closeMobileMenu}>Tutors</Link></li>
                <li><Link href={ROUTES.ABOUT} onClick={closeMobileMenu}>About</Link></li>
                <li><Link href={ROUTES.DOCS} onClick={closeMobileMenu}>Docs</Link></li>

                {/* Mobile-only Login/Register buttons */}
                {user ? (
                    <>
                        <li className={style.mobileAuthButtons}>
                            <Link href={route('profile.edit')} className={style.mobileProfile} onClick={closeMobileMenu}>Profile</Link> 
                        </li>
                        {user.role === 'admin' && (
                            <li className={style.mobileAuthButtons}>
                                <Link href={ROUTES.ADMIN_DASHBOARD} className={style.mobileAdminDashboard} onClick={closeMobileMenu}>Admin Dashboard</Link>
                            </li>
                        )}
                        <li className={style.mobileAuthButtons}>
                            <button className={style.mobileLogout} onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                )
                :
                (
                    <>
                        <li className={style.mobileAuthButtons}>
                            <Link href={ROUTES.LOGIN} className={`${style.mobileLogin} ${style.LoginMarginTop}`} onClick={closeMobileMenu}>Login</Link>
                        </li>
                        <li className={style.mobileAuthButtons}>
                            <Link href={ROUTES.REGISTER} className={style.mobileRegister} onClick={closeMobileMenu}>Register</Link>
                        </li>
                    </>
                )
            }
                
            </ul>

            {/* Desktop Login/Register Buttons */}
            {user ? (
                <div className={style.LoginRegister}>
                    {/* Admin Dashboard Link for Desktop */}
                    {user.role === 'admin' && (
                        <Link href={ROUTES.ADMIN_DASHBOARD} className={style.adminDashboardDesktop} onClick={closeMobileMenu}>
                            <span className={style.adminIcon}>⚙️</span>
                            Admin
                        </Link>
                    )}
                    <Link href={route('profile.edit')} className={style.profile} onClick={closeMobileMenu}>
                        {user.name.charAt(0)}
                    </Link>
                    <button className={style.logout} onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className={style.LoginRegister}>
                    <Link href={ROUTES.LOGIN} className={style.login} onClick={closeMobileMenu}>Login</Link>
                    <Link href={ROUTES.REGISTER} className={style.register} onClick={closeMobileMenu}>Register</Link>
                </div>
            )}

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className={style.mobileOverlay}
                    onClick={closeMobileMenu}
                ></div>
            )}
        </nav>
    );
}