import React, { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalTutors: 0,
        totalEnrollments: 0
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch real stats and activities from the backend
            const [statsResponse, activitiesResponse] = await Promise.all([
                fetch('/admin/dashboard/stats', {
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                }),
                fetch('/admin/dashboard/activities', {
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                })
            ]);

            if (!statsResponse.ok || !activitiesResponse.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const statsData = await statsResponse.json();
            const activitiesData = await activitiesResponse.json();

            setStats({
                totalUsers: statsData.totalUsers,
                totalCourses: statsData.totalCourses,
                totalTutors: statsData.totalTutors,
                totalEnrollments: statsData.totalEnrollments
            });
            
            setActivities(activitiesData);
            setLoading(false);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <AdminLayout>
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div>
                            <h1 className={styles.title}>Admin Dashboard</h1>
                            <p className={styles.subtitle}>Welcome back, {user?.name}! Manage your Darisni platform from here.</p>
                        </div>
                        <button 
                            onClick={fetchDashboardData} 
                            disabled={loading}
                            className={styles.refreshButton}
                            title="Refresh dashboard data"
                        >
                            {loading ? '⟳' : '🔄'}
                        </button>
                    </div>
                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                </div>

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statContent}>
                        <h3>{loading ? '...' : stats.totalUsers.toLocaleString()}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statContent}>
                        <h3>{loading ? '...' : stats.totalCourses}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👨‍🏫</div>
                    <div className={styles.statContent}>
                        <h3>{loading ? '...' : stats.totalTutors}</h3>
                        <p>Active Tutors</p>
                    </div>
                </div>
                
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🎓</div>
                    <div className={styles.statContent}>
                        <h3>{loading ? '...' : stats.totalEnrollments.toLocaleString()}</h3>
                        <p>Tutor Assignments</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.actionsSection}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    <Link href={route('admin.users')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>👥</div>
                        <h3>Manage Users</h3>
                        <p>Add, edit, or remove user accounts</p>
                    </Link>
                    
                    <Link href={route('admin.courses')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>📚</div>
                        <h3>Manage Courses</h3>
                        <p>Create and organize course content</p>
                    </Link>
                    
                    <Link href={route('admin.tutors')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>👨‍🏫</div>
                        <h3>Manage Tutors</h3>
                        <p>Manage tutor profiles, courses, and availability</p>
                    </Link>
                    
                    <Link href={route('admin.reviews')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>⭐</div>
                        <h3>Manage Reviews</h3>
                        <p>Monitor and manage course reviews and ratings</p>
                    </Link>
                    
                    <Link href={route('admin.categories')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>📂</div>
                        <h3>Manage Categories</h3>
                        <p>Create and organize course categories</p>
                    </Link>

                    <Link href={route('admin.enrollments')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>📋</div>
                        <h3>Manage Enrollments</h3>
                        <p>View and manage course enrollments</p>
                    </Link>

                    <Link href={route('admin.course-suggestions')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>💡</div>
                        <h3>Manage Course Suggestions</h3>
                        <p>View and respond to course suggestions from users</p>
                    </Link>

                    <Link href={route('home')} className={styles.actionCard}>
                        <div className={styles.actionIcon}>🌐</div>
                        <h3>Preview Website</h3>
                        <p>See how the public website looks</p>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className={styles.activitySection}>
                <h2 className={styles.sectionTitle}>Recent Activity</h2>
                <div className={styles.activityList}>
                    {loading ? (
                        <div className={styles.loadingMessage}>Loading activities...</div>
                    ) : activities.length > 0 ? (
                        activities.map((activity, index) => (
                            <div key={index} className={styles.activityItem}>
                                <div className={styles.activityIcon}>{activity.icon}</div>
                                <div className={styles.activityContent}>
                                    <p dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                                    <span className={styles.activityTime}>{activity.formatted_time}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.noActivityMessage}>No recent activity found.</div>
                    )}
                </div>
            </div>
            </div>
        </AdminLayout>
    );
}
