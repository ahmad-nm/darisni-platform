import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import styles from './AdminSidebar.module.css';
import { ROUTES } from '@/constants/routes';

export default function AdminSidebar({ isOpen, onToggle }) {
    const { url } = usePage().props;

    const menuItems = [
        {
            name: 'Dashboard',
            href: route('admin.dashboard'),
            icon: '📊',
            active: url === ROUTES.ADMIN_DASHBOARD
        },
        {
            name: 'User Management',
            href: route('admin.users'),
            icon: '👥',
            active: url.includes(ROUTES.ADMIN_USERS),
            badge: '142'
        },
        {
            name: 'Course Management',
            href: route('admin.courses'),
            icon: '📚',
            active: url.includes(ROUTES.ADMIN_COURSES),
            badge: '28'
        },
        {
            name: 'Tutor Management',
            href: route('admin.tutors'),
            icon: '👨‍🏫',
            active: url.includes(ROUTES.ADMIN_TUTORS),
            badge: '15'
        },
        {
            name: 'Category Management',
            href: route('admin.categories'),
            icon: '📂',
            active: url.includes(ROUTES.ADMIN_CATEGORIES)
        },
        {
            name: 'Review Management',
            href: route('admin.reviews'),
            icon: '⭐',
            active: url.includes(ROUTES.ADMIN_REVIEWS),
            badge: '8'
        },
        {
            name: 'Enrollment Management',
            href: route('admin.enrollments'),
            icon: '📝',
            active: url.includes(ROUTES.ADMIN_ENROLLMENTS)
        },
        {
            name: 'Tutor Applications',
            href: route('admin.applications'),
            icon: '📝',
            active: url.includes(ROUTES.ADMIN_TUTOR_APP),
            badge: '3',
            badgeColor: 'warning'
        },
        {
            name: 'Course Suggestions',
            href: route('admin.course-suggestions'),
            icon: '💡',
            active: url.includes(ROUTES.ADMIN_COURSE_SUGGESTIONS),
            badge: '5',
            badgeColor: 'info'
        }
    ];

    const quickActions = [
        {
            name: 'Add New User',
            href: route('admin.users.create'),
            icon: '➕',
            color: 'primary'
        },
        {
            name: 'View Website',
            href: route('home'),
            icon: '🌐',
            color: 'secondary'
        }
    ];

    return (
        <>
            {/* Sidebar Overlay for Mobile */}
            {isOpen && (
                <div 
                    className={styles.overlay}
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                {/* Sidebar Header */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>🎓</span>
                            <span className={styles.logoText}>Darisni Admin</span>
                        </div>
                        <button 
                            className={styles.closeButton}
                            onClick={onToggle}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className={styles.navigation}>
                    <div className={styles.menuSection}>
                        <h3 className={styles.sectionTitle}>Management</h3>
                        <ul className={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <li key={index} className={styles.menuItem}>
                                    <Link
                                        href={item.href}
                                        className={`${styles.menuLink} ${item.active ? styles.active : ''}`}
                                        onClick={() => window.innerWidth <= 768 && onToggle()}
                                    >
                                        <span className={styles.menuIcon}>{item.icon}</span>
                                        <span className={styles.menuText}>{item.name}</span>
                                        {item.badge && (
                                            <span className={`${styles.badge} ${item.badgeColor ? styles[item.badgeColor] : styles.default}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.menuSection}>
                        <h3 className={styles.sectionTitle}>Quick Actions</h3>
                        <ul className={styles.actionsList}>
                            {quickActions.map((action, index) => (
                                <li key={index} className={styles.actionItem}>
                                    <Link
                                        href={action.href}
                                        className={`${styles.actionLink} ${styles[action.color]}`}
                                        onClick={() => window.innerWidth <= 768 && onToggle()}
                                    >
                                        <span className={styles.actionIcon}>{action.icon}</span>
                                        <span className={styles.actionText}>{action.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Sidebar Footer */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.footerStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Online Users</span>
                            <span className={styles.statValue}>47</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>System Status</span>
                            <span className={styles.statusIndicator}>
                                <span className={styles.statusDot}></span>
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
