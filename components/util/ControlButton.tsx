
import React from 'react';
import styles from './ControlButton.module.scss';

type ControlButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    icon: string;
    alt: string;
    text?: string;
};

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, onContextMenu, icon, alt, text }) => {
    return (
        <button className={styles.controlButton} onClick={onClick} onContextMenu={onContextMenu}>
            <div className={styles.icon}>
                <img src={icon} width={16} height={16} alt={alt} className={styles.invertedImage} />
                {text && <span className={styles.controlButtonText}>{text}</span>}
            </div>
        </button >
    );
};

export default ControlButton;