import style from "../Docs.module.css";

export default function DocsFooter() {
    return (
        <div className={style.docsFooter}>
            <div className={style.footerContent}>
                <div className={style.helpSection}>
                    <h3>Still need help?</h3>
                    <p>Our support team is here to assist you</p>
                    <div className={style.helpButtons}>
                        <button
                            className={style.helpBtn}
                            onClick={() =>
                                (window.location.href =
                                    "mailto:info@darisni.net")
                            }
                        >
                            📧 Email Support
                        </button>
                    </div>
                </div>

                <div className={style.updateInfo}>
                    <p>📅 Last updated: {new Date().toLocaleDateString()}</p>
                    <p>Version 2.1.0</p>
                </div>
            </div>
        </div>
    );
}
