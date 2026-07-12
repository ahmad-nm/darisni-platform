import style from './CCHeader.module.css';

export function CCHeader() {
    return (
        <header className={style.header}>
            <div className={style.content}>
                <h1 className={style.title}>Our Courses</h1>
            </div>
        </header>
    )
}