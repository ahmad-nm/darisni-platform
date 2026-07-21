import React, { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import styles from "./Dashboard.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { fetchDashboardData } from "../../../services/dashboardService";
import { StatsGrid } from "./components/StatsGrid/StatsGrid";
import { QuickActions } from "./components/QuickActions/QuickActions";
import { ActivitySection } from "./components/ActivitySection/ActivitySection";
import { DashboardHeader } from "./components/DashboardHeader/DashboardHeader";

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        totalTutors: 0,
        totalEnrollments: 0,
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const { stats, activities } = await fetchDashboardData();

            setStats(stats);
            setActivities(activities);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <AdminLayout>
            <div className={styles.dashboard}>
                <DashboardHeader
                    user={user}
                    loading={loading}
                    error={error}
                    onRefresh={loadDashboard}
                />

                {/* Quick Stats */}
                <StatsGrid loading={loading} stats={stats} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Activity */}
                <ActivitySection loading={loading} activities={activities} />
            </div>
        </AdminLayout>
    );
}
