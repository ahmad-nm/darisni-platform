import styles from "../UserManagement.module.css";
import UserDetailsView from "./UserModal/UserDetailsView";
import UserEditForm from "./UserModal/UserEditForm";

export default function UserModal({ user, mode, onClose, onUpdate, setModalMode }) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{mode === "view" ? "User Details" : "Edit User"}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ×
                    </button>
                </div>

                {mode === "view" ? (
                    <UserDetailsView
                        user={user}
                        onClose={onClose}
                        onEdit={() => setModalMode("edit")}
                    />
                ) : (
                    <UserEditForm
                        user={user}
                        onUpdate={onUpdate}
                        onClose={onClose}
                    />
                )}
            </div>
        </div>
    );
}