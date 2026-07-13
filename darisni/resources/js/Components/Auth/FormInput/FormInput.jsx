import styles from './FormInput.module.css';

export default function FormInput({ id, type, name, value, placeholder, autoComplete, autoFocus, onChange, ...props }) {
    return (
        <input
            id={id}
            type={type}
            name={name}
            value={value}
            className={styles.formInput}
            placeholder={placeholder}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            required
            onChange={onChange}
            {...props}
        />
    );
}