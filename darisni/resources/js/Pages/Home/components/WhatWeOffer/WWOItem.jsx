import style from './WWOItem.module.css';

export function WWOItem({ Item }) {
    return (
        <div className={style.WWOItem} style={{ backgroundColor: Item.color }}>
            <img src={Item.image} alt={Item.title} className={style.WWOItemImage} />
            <h3 className={style.WWOItemTitle}>{Item.title}</h3>
            <p className={style.WWOItemDescription}>{Item.description}</p>
            <a href={Item.link} className={style.WWOItemLink}>Read More</a>
        </div>
    );
}