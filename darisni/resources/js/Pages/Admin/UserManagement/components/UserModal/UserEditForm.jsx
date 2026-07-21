import React, { useState } from "react";
import styles from "../../UserManagement.module.css";
import { uploadUserImage } from "@/services/admin/userManagementService";

export default function UserEditForm({ user, onUpdate, onClose }) {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        role: user.role,
        email_verified_at: !!user.email_verified_at,
        image: user.image || "",
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const updateField = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setUploading(true);

        try {
            const data = await uploadUserImage(file);

            if (data.url) {
                updateField("image", data.url);
            }
        } catch (error) {
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        updateField("image", "");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);

        const payload = {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            email_verified_at: formData.email_verified_at ? 1 : 0,
        };

        await onUpdate(payload);

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.modalForm}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={styles.modalInput}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={styles.modalInput}
                    required
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="role">Role</label>

                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className={styles.modalInput}
                >
                    <option value="admin">Admin</option>

                    <option value="tutor">Tutor</option>

                    <option value="student">Student</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="image">Profile Image</label>

                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className={styles.modalInput}
                />

                {uploading && <span>Uploading...</span>}

                {formData.image && (
                    <div>
                        <img src={formData.image} alt="User" width="80" />

                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className={styles.removeImageBtn}
                        >
                            Remove Image
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label>
                    <input
                        id="email_verified_at"
                        name="email_verified_at"
                        type="checkbox"
                        checked={formData.email_verified_at}
                        onChange={(e) =>
                            updateField("email_verified_at", e.target.checked)
                        }
                    />
                    Email Verified
                </label>
            </div>

            <div className={styles.modalActions}>
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.cancelBtn}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className={styles.saveBtn}
                >
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
