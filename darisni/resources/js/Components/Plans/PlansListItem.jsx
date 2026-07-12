import ThunderIcon from '../../assets/Icons/thunder.png';
import style from './PlansListItem.module.css';

export function PlansListItem({ plan }) {
    return (
        <div className={style.planItem}>
            <div className={style.Icon}>
                <img src={ThunderIcon} alt="Plan Icon" />
                <p className={style.planType}>{plan.type}</p>
            </div>
            <h2>{plan.name}</h2>
            <p className={style.description}>{plan.description}</p>
            <p className={style.planPrice}>${plan.price}<span>/sem</span></p>
            <div className={style.features}>
                <ul className={style.featuresList}>
                    {plan.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <button className={style.buyBtn}>Select Plan</button>
            </div>
        </div>
    );
}