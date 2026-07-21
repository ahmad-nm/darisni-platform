import styles from "../newUser.module.css";

export default function UserFormFields({
    formData,
    errors,
    loading,
    onChange,
}) {
    return (
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
                    onChange={onChange}
                    className={`${styles.input} ${
                        errors.name ? styles.inputError : ""
                    }`}
                    placeholder="Enter full name"
                    disabled={loading}
                />

                {errors.name && (
                    <span className={styles.fieldError}>
                        {errors.name}
                    </span>
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
                    onChange={onChange}
                    className={`${styles.input} ${
                        errors.email ? styles.inputError : ""
                    }`}
                    placeholder="Enter email address"
                    disabled={loading}
                />

                {errors.email && (
                    <span className={styles.fieldError}>
                        {errors.email}
                    </span>
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
                    onChange={onChange}
                    className={`${styles.input} ${
                        errors.password ? styles.inputError : ""
                    }`}
                    placeholder="Enter password (min. 8 characters)"
                    disabled={loading}
                />

                {errors.password && (
                    <span className={styles.fieldError}>
                        {errors.password}
                    </span>
                )}
            </div>


            {/* Confirm Password Field */}
            <div className={styles.formGroup}>
                <label
                    htmlFor="password_confirmation"
                    className={styles.label}
                >
                    Confirm Password *
                </label>

                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={onChange}
                    className={`${styles.input} ${
                        errors.password_confirmation
                            ? styles.inputError
                            : ""
                    }`}
                    placeholder="Confirm password"
                    disabled={loading}
                />

                {errors.password_confirmation && (
                    <span className={styles.fieldError}>
                        {errors.password_confirmation}
                    </span>
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
                    onChange={onChange}
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
                        onChange={onChange}
                        className={styles.checkbox}
                        disabled={loading}
                    />

                    <label
                        htmlFor="email_verified_at"
                        className={styles.checkboxLabel}
                    >
                        Mark email as verified
                    </label>

                </div>

                <p className={styles.checkboxHelper}>
                    Check this if you want to skip email verification for this user
                </p>
            </div>

        </div>
    );
}