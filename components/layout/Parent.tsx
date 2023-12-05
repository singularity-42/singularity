// a larger spacer looks like entity but its smaller and will be collapasable and will have a button to expand it 

import React, { useEffect } from 'react';
import styles from './Parent.module.scss';

interface ParentProps {
    title: string;
    onToggleOpen?: (isOpen: boolean) => void;
  }

  // it will have the title on the left and a button on the right to expand it
  // the button will be arrow up and down

const Parent: React.FC<ParentProps> = ({ title, onToggleOpen }) => {
    const [isOpen, setIsOpen] = React.useState(false); // State to track hover

    useEffect(() => {
        if (onToggleOpen) {
          onToggleOpen(isOpen);
        }
      }, [isOpen]);

    return (
        <div
            className={styles.parentContainer}
            onClick={() => setIsOpen(!isOpen)} // Set isHovered to true on mouse enter
        >
            <div className={styles.title}>{title}</div>
            <div className={styles.button}>{isOpen ? '▲' : '▼'}</div>
        </div>
    );

}

export default Parent;

