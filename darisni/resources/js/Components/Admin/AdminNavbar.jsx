import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import styles from './AdminNavbar.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/authService';
import { navigate } from '@/utils/navigationService';
import { ROUTES } from '@/constants/routes';

export default function AdminNavbar() {
    const { url } = usePage().props;
    const { user } = useAuth();
    const currentUrl = url || '';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);

    const safeRoute = (routeName, fallback = '#') => {
        try {
            const routeUrl = route(routeName);
            return routeUrl;
        } catch (error) {
            console.warn(`Route '${routeName}' not found, using fallback:`, fallback);
            return fallback;
        }
    };

    const navigationItems = [
        {
            name: 'Dashboard',
            href: safeRoute('admin.dashboard'),
            icon: '📊',
            active: currentUrl === ROUTES.ADMIN_DASHBOARD
        },
        {
            name: 'Management',
            icon: '⚙️',
            dropdown: true,
            active: currentUrl.includes('/admin/users') || currentUrl.includes('/admin/courses') || currentUrl.includes('/admin/tutors') || currentUrl.includes('/admin/categories') || currentUrl.includes('/admin/reviews'),
            items: [
                { name: 'Users', href: safeRoute('admin.users'), icon: '👥' },
                { name: 'Courses', href: safeRoute('admin.courses'), icon: '📚' },
                { name: 'Tutors', href: safeRoute('admin.tutors'), icon: '👨‍🏫' },
                { name: 'Categories', href: safeRoute('admin.categories'), icon: '📂' },
                { name: 'Reviews', href: safeRoute('admin.reviews'), icon: '⭐' },
                { name: 'Enrollments', href: safeRoute('admin.enrollments'), icon: '📝' },
                { name: 'Course Suggestions', href: safeRoute('admin.course-suggestions'), icon: '💡' },
            ]
        },
        {
            name: 'Applications',
            href: safeRoute('admin.applications.page', '/admin/applications'),
            icon: '📝',
            active: currentUrl.includes('/admin/applications')
        },
    ];

    const handleLogout = () => {
        try {
            logout({
                onSuccess: () => {
                    navigate(safeRoute('login', ROUTES.LOGIN));
                },
                onError: (error) => {
                    console.error('Logout failed:', error);
                },
            });
        } catch (error) {
            console.warn('Logout route not found, redirecting to home');
            window.location.href = '/';
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const toggleManagementDropdown = () => {
        setIsManagementDropdownOpen(!isManagementDropdownOpen);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                {/* Logo and Brand */}
                <div className={styles.brand}>
                    <Link href={safeRoute('admin.dashboard')} className={styles.brandLink}>
                        <div className={styles.logo}>🎓</div>
                        <div className={styles.brandText}>
                            <span className={styles.brandName}>Darisni</span>
                            <span className={styles.brandSub}>Admin</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    <div className={styles.navLinks}>
                        {navigationItems.map((item, index) => (
                            <div key={index} className={styles.navItem}>
                                {item.dropdown ? (
                                    <div className={styles.dropdown}>
                                        <button
                                            onClick={toggleManagementDropdown}
                                            className={`${styles.navLink} ${item.active ? styles.active : ''} ${styles.dropdownToggle}`}
                                        >
                                            <span className={styles.navIcon}>{item.icon}</span>
                                            {item.name}
                                            <span className={`${styles.dropdownArrow} ${isManagementDropdownOpen ? styles.open : ''}`}>
                                                ▼
                                            </span>
                                        </button>
                                        {isManagementDropdownOpen && (
                                            <div className={styles.dropdownMenu}>
                                                {item.items.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        href={subItem.href}
                                                        className={styles.dropdownItem}
                                                        onClick={() => setIsManagementDropdownOpen(false)}
                                                    >
                                                        <span className={styles.dropdownIcon}>{subItem.icon}</span>
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`${styles.navLink} ${item.active ? styles.active : ''}`}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className={styles.rightSide}>
                        {/* Quick Actions */}
                        <div className={styles.quickActions}>
                            <Link href={safeRoute('home')} className={styles.quickAction} title="View Website">
                                🌐
                            </Link>
                        </div>

                        {/* Profile Dropdown */}
                        <div className={styles.profileDropdown}>
                            <button
                                onClick={toggleProfileDropdown}
                                className={styles.profileButton}
                            >
                                <div className={styles.profileAvatar}>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.profileInfo}>
                                    <span className={styles.profileName}>{user?.name}</span>
                                    <span className={styles.profileRole}>Administrator</span>
                                </div>
                                <span className={`${styles.profileArrow} ${isProfileDropdownOpen ? styles.open : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isProfileDropdownOpen && (
                                <div className={styles.profileMenu}>
                                    <div className={styles.profileMenuHeader}>
                                        <div className={styles.profileMenuAvatar}>
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className={styles.profileMenuName}>{user?.name}</div>
                                            <div className={styles.profileMenuEmail}>{user?.email}</div>
                                        </div>
                                    </div>
                                    <div className={styles.profileMenuDivider}></div>
                                    <Link href={safeRoute('profile.edit')} className={styles.profileMenuItem}>
                                        <span className={styles.profileMenuIcon}>👤</span>
                                        Profile Settings
                                    </Link>
                                    <Link href={safeRoute('home')} className={styles.profileMenuItem}>
                                        <span className={styles.profileMenuIcon}>🌐</span>
                                        View Website
                                    </Link>
                                    <div className={styles.profileMenuDivider}></div>
                                    <button onClick={handleLogout} className={styles.profileMenuItem}>
                                        <span className={styles.profileMenuIcon}>🚪</span>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className={styles.mobileMenuButton}
                >
                    <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className={styles.mobileNav}>
                    <div className={styles.mobileNavHeader}>
                        <div className={styles.mobileUserInfo}>
                            <div className={styles.mobileAvatar}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className={styles.mobileUserName}>{user?.name}</div>
                                <div className={styles.mobileUserRole}>Administrator</div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.mobileNavLinks}>
                        {navigationItems.map((item, index) => (
                            <div key={index}>
                                {item.dropdown ? (
                                    <>
                                        <div className={styles.mobileNavGroup}>
                                            <span className={styles.mobileNavGroupTitle}>
                                                <span className={styles.navIcon}>{item.icon}</span>
                                                {item.name}
                                            </span>
                                        </div>
                                        {item.items.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                href={subItem.href}
                                                className={styles.mobileNavSubItem}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span className={styles.navIcon}>{subItem.icon}</span>
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`${styles.mobileNavLink} ${item.active ? styles.active : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className={styles.navIcon}>{item.icon}</span>
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className={styles.mobileNavFooter}>
                        <Link href={safeRoute('profile.edit')} className={styles.mobileNavFooterItem}>
                            <span className={styles.navIcon}>👤</span>
                            Profile Settings
                        </Link>
                        <button onClick={handleLogout} className={styles.mobileNavFooterItem}>
                            <span className={styles.navIcon}>🚪</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
