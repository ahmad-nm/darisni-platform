import Modal from "@/Components/common/Modal";
import ProfileButton from "@/Components/Profile/ProfileButton/ProfileButton";
import ProfilePasswordInput from "@/Components/Profile/ProfilePasswordInput/ProfilePasswordInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import styles from "./DeleteUserForm.module.css";
import { deleteAccount } from "@/services/profileService";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
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
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = async (e) => {
        e.preventDefault();

        try {
            await deleteAccount(data.password);
            closeModal();
        } catch {
            passwordInput.current.focus();
        } finally {
            reset();
        }
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
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Before deleting your
                        account, please download any data or information that
                        you wish to retain.
                    </p>
                </div>
            </div>

            <ProfileButton
                type="button"
                onClick={confirmUserDeletion}
                variant="danger"
                icon="🗑️"
            >
                Delete Account
            </ProfileButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <div className={styles.modalIcon}>🚨</div>
                        <h2 className={styles.modalTitle}>
                            Are you sure you want to delete your account?
                        </h2>
                        <p className={styles.modalDescription}>
                            This action cannot be undone. All of your data,
                            courses, and account information will be permanently
                            deleted from our servers.
                        </p>
                    </div>

                    <form onSubmit={deleteUser} className={styles.modalForm}>
                        <div className={styles.confirmationChecks}>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>📚</span>
                                <span>
                                    All your courses and progress will be lost
                                </span>
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>💬</span>
                                <span>
                                    All your reviews and comments will be
                                    deleted
                                </span>
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkIcon}>👤</span>
                                <span>
                                    Your profile and personal information will
                                    be removed
                                </span>
                            </div>
                        </div>

                        <div className={styles.passwordConfirmation}>
                            <ProfilePasswordInput
                                id="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                label="Enter your password to confirm"
                                icon="🔒"
                                error={errors.password}
                                placeholder="Enter your password"
                                autoFocus
                            />
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

                            <ProfileButton
                                type="submit"
                                disabled={processing}
                                loading={processing}
                                variant="danger"
                                icon="💀"
                            >
                                Delete My Account
                            </ProfileButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
