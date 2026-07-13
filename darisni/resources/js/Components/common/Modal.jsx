import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import styles from './Modal.module.css';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClassName = {
        sm: styles.maxWidthSm,
        md: styles.maxWidthMd,
        lg: styles.maxWidthLg,
        xl: styles.maxWidthXl,
        '2xl': styles.maxWidth2xl,
    }[maxWidth] ?? styles.maxWidth2xl;

    return (
        <Transition show={show}>
            <Dialog
                as="div"
                id="modal"
                className={styles.dialog}
                onClose={close}
            >
                <TransitionChild
                    enter={styles.overlayEnter}
                    enterFrom={styles.overlayEnterFrom}
                    enterTo={styles.overlayEnterTo}
                    leave={styles.overlayLeave}
                    leaveFrom={styles.overlayLeaveFrom}
                    leaveTo={styles.overlayLeaveTo}
                >
                    <div className={styles.overlay} />
                </TransitionChild>

                <TransitionChild
                    enter={styles.panelEnter}
                    enterFrom={styles.panelEnterFrom}
                    enterTo={styles.panelEnterTo}
                    leave={styles.panelLeave}
                    leaveFrom={styles.panelLeaveFrom}
                    leaveTo={styles.panelLeaveTo}
                >
                    <DialogPanel
                        className={`${styles.panel} ${maxWidthClassName}`}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
