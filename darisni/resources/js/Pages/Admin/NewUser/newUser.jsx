import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import styles from './newUser.module.css';
import AdminLayout from '@/Layouts/AdminLayout.jsx';

export default function NewUser() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
        email_verified_at: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Prepare data for submission
        const submitData = {
            ...formData,
            // Send boolean value for email_verified_at
        };

        console.log('Submitting data:', submitData); // Debug log

        router.post('/admin/users', submitData, {
            onSuccess: () => {
                // Redirect will happen automatically
            },
            onError: (errors) => {
                setErrors(errors);
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            }
        });
    };

    // Handle cancel
    const handleCancel = () => {
        router.get('/admin/users');
    };

    return (
        <AdminLayout>
            <Head title="Add New User" />
            <div className={styles.newUserPage}>
                
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Add New User</h1>
                        <p className={styles.subtitle}>Create a new user account</p>
                    </div>

                    <div className={styles.formCard}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                {/* Name Field */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                                        placeholder="Enter full name"
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <span className={styles.fieldError}>{errors.name}</span>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.label}>
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                        placeholder="Enter email address"
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <span className={styles.fieldError}>{errors.email}</span>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="password" className={styles.label}>
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                        placeholder="Enter password (min. 8 characters)"
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <span className={styles.fieldError}>{errors.password}</span>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="password_confirmation" className={styles.label}>
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleInputChange}
                                        className={`${styles.input} ${errors.password_confirmation ? styles.inputError : ''}`}
                                        placeholder="Confirm password"
                                        disabled={loading}
                                    />
                                    {errors.password_confirmation && (
                                        <span className={styles.fieldError}>{errors.password_confirmation}</span>
                                    )}
                                </div>

                                {/* Role Field */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="role" className={styles.label}>
                                        User Role
                                    </label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className={styles.select}
                                        disabled={loading}
                                    >
                                        <option value="student">Student</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {/* Email Verified Checkbox */}
                                <div className={styles.formGroup}>
                                    <div className={styles.checkboxGroup}>
                                        <input
                                            type="checkbox"
                                            id="email_verified_at"
                                            name="email_verified_at"
                                            checked={formData.email_verified_at}
                                            onChange={handleInputChange}
                                            className={styles.checkbox}
                                            disabled={loading}
                                        />
                                        <label htmlFor="email_verified_at" className={styles.checkboxLabel}>
                                            Mark email as verified
                                        </label>
                                    </div>
                                    <p className={styles.checkboxHelper}>
                                        Check this if you want to skip email verification for this user
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className={styles.cancelButton}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Creating User...
                                        </>
                                    ) : (
                                        'Create User'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}