import style from "./SectionCard.module.css";

export default function SectionCard({
    icon,
    title,
    description,
    children,
    danger = false,
}) {
    return (
        <div
            className={`${style.sectionCard} ${
                danger ? style.dangerZone : ""
            }`}
        >
            <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>
                    <span className={style.sectionIcon}>
                        {icon}
                    </span>

                    {title}
                </h2>

                <p className={style.sectionDescription}>
                    {description}
                </p>
            </div>

            <div className={style.sectionContent}>
                {children}
            </div>
        </div>
    );
}