import { useState, useEffect } from 'react';
import style from './nav.module.css';
// import logo from '../../assets/logo.png';
import { Link, usePage, router } from "@inertiajs/react";
import { route } from 'ziggy-js';

export function Navbar(){
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        router.post(route('logout'));
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
                <li><Link href="/" onClick={closeMobileMenu}>Home</Link></li>
                <li><Link href="/course-categories" onClick={closeMobileMenu}>Courses</Link></li>
                <li><Link href="/tutors" onClick={closeMobileMenu}>Tutors</Link></li>
                <li><Link href="/about" onClick={closeMobileMenu}>About</Link></li>
                <li><Link href="/docs" onClick={closeMobileMenu}>Docs</Link></li>
                
                {/* Mobile-only Login/Register buttons */}
                {user ? (
                    <>
                        <li className={style.mobileAuthButtons}>
                            <Link href={route('profile.edit')} className={style.mobileProfile} onClick={closeMobileMenu}>Profile</Link> 
                        </li>
                        {user.role === 'admin' && (
                            <li className={style.mobileAuthButtons}>
                                <Link href="/admin/dashboard" className={style.mobileAdminDashboard} onClick={closeMobileMenu}>Admin Dashboard</Link>
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
                            <Link href="/login" className={`${style.mobileLogin} ${style.LoginMarginTop}`} onClick={closeMobileMenu}>Login</Link>
                        </li>
                        <li className={style.mobileAuthButtons}>
                            <Link href="/register" className={style.mobileRegister} onClick={closeMobileMenu}>Register</Link>
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
                        <Link href="/admin/dashboard" className={style.adminDashboardDesktop} onClick={closeMobileMenu}>
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
                    <Link href="/login" className={style.login} onClick={closeMobileMenu}>Login</Link>
                    <Link href="/register" className={style.register} onClick={closeMobileMenu}>Register</Link>
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