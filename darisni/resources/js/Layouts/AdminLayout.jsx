import React from 'react';
import AdminNavbar from '@/Components/Admin/AdminNavbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
    return (
        <div className={styles.adminLayout}>
            <AdminNavbar />
            <div className={styles.adminContent}>
                {children}
            </div>
        </div>
    );
}
