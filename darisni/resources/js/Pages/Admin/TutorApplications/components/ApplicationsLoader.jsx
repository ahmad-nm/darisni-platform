import AdminLayout from "../../../../Layouts/AdminLayout";
import styles from "../TutorApplications.module.css";

export default function ApplicationsLoader() {
    return (
        <AdminLayout>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Loading applications...</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
