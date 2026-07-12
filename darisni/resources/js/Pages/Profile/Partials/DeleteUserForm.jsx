import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import styles from './DeleteUserForm.module.css';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <div className={styles.dangerZone}>
            <div className={styles.warningSection}>
                <div className={styles.warningIcon}>⚠️</div>
                <div className={styles.warningContent}>
                    <h3 className={styles.warningTitle}>Danger Zone</h3>
                    <p className={styles.warningText}>
                        Once your account is deleted, all of its resources and data will be permanently deleted. 
                        Before deleting your account, please download any data or information that you wish to retain.
                    </p>
                </div>
            </div>

            <button 
                onClick={confirmUserDeletion}
                className={styles.deleteButton}
            >
                <span className={styles.deleteIcon}>🗑️</span>
                Delete Account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <div className={styles.modalIcon}>🚨</div>
                        <h2 className={styles.modalTitle}>
                            Are you sure you want to delete your account?
                        </h2>
                        <p className={styles.modalDescription}>
                            This action cannot be undone. All of your data, courses, and account information 
                            will be permanently deleted from our servers.
                        </p>
                    </div>

                    <form onSubmit={deleteUser} className={styles.modalForm}>
                        <div className={styles.confirmationChecks}>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>📚</span>
                                <span>All your courses and progress will be lost</span>
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>💬</span>
                                <span>All your reviews and comments will be deleted</span>
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>👤</span>
                                <span>Your profile and personal information will be removed</span>
                            </div>
                        </div>

                        <div className={styles.passwordConfirmation}>
                            <label htmlFor="password" className={styles.passwordLabel}>
                                <span className={styles.labelIcon}>🔒</span>
                                Enter your password to confirm
                            </label>
                            <div className={styles.passwordField}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
                                    placeholder="Enter your password"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            {errors.password && (
                                <div className={styles.errorMessage}>
                                    <span className={styles.errorIcon}>⚠️</span>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={closeModal}
                                className={styles.cancelButton}
                            >
                                <span className={styles.cancelIcon}>❌</span>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className={`${styles.confirmDeleteButton} ${processing ? styles.deleting : ''}`}
                            >
                                {processing ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Deleting Account...
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.confirmDeleteIcon}>💀</span>
                                        Delete My Account
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
