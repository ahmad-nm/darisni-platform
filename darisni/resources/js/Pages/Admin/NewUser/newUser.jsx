import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import styles from "./newUser.module.css";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import UserFormFields from "./components/UserFormFields.jsx";
import FormActions from "./components/FormActions";
import { createUser } from "../../../services/admin/userService.js";

export default function NewUser() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "student",
        email_verified_at: false,
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
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

        console.log("Submitting data:", submitData); // Debug log

        createUser(formData, {
            onError: (errors) => {
                setErrors(errors);
            },

            onFinish: () => {
                setLoading(false);
            },
        });
    };

    // Handle cancel
    const handleCancel = () => {
        router.get("/admin/users");
    };

    return (
        <AdminLayout>
            <Head title="Add New User" />
            <div className={styles.newUserPage}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Add New User</h1>
                        <p className={styles.subtitle}>
                            Create a new user account
                        </p>
                    </div>

                    <div className={styles.formCard}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <UserFormFields
                                formData={formData}
                                errors={errors}
                                loading={loading}
                                onChange={handleInputChange}
                            />

                            {/* Action Buttons */}
                            <FormActions
                                loading={loading}
                                onCancel={handleCancel}
                                />
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}