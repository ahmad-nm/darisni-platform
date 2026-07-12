import { PlansListItem } from './PlansListItem.jsx';
import { plans } from '../../Objects/Plans.js';
import style from './PlansList.module.css';

export function PlansList(){
    return (
        <div className={style.plansListContainer}>
            <h1 className={style.plansTitle}>Customized Plans For All Budgets</h1>
            <p className={style.subtitle}>Choose The Plan That Best Suits You</p>
            <div className={style.plansList}>
                {plans.map((plan) => (
                    <PlansListItem plan={plan} key={plan.id} />
                ))}
            </div>
        </div>
    )
}