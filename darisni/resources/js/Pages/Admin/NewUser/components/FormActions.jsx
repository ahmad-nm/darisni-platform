import styles from "../newUser.module.css";

export default function FormActions({
    loading,
    onCancel,
}) {
    return (
        <div className={styles.actionButtons}>

            <button
                type="button"
                onClick={onCancel}
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
                    "Create User"
                )}
            </button>

        </div>
    );
}