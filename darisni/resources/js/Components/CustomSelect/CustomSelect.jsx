import { useState } from 'react';
import style from './CustomSelect.module.css';

export function CustomSelect({ id, value, onChange, options, placeholder, onOpenChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue) => {
        onChange({ target: { id, value: optionValue } });
        setIsOpen(false);
        if (onOpenChange) onOpenChange(false);
    };

    const handleTriggerClick = () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);
        if (onOpenChange) onOpenChange(nextOpen);
    };

    return (
        <div className={style.customSelect}>
            <div
                className={style.selectTrigger}
                onClick={handleTriggerClick}
            >
                <span className={style.selectValue}>
                    {value || placeholder}
                </span>
                <span className={`${style.selectArrow} ${isOpen ? style.open : ''}`}>▼</span>
            </div>
            
            {isOpen && (
                <div className={style.selectOptions}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`${style.selectOption} ${value === option.value ? style.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}