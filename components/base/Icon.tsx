import React, { useState } from 'react';
import { MdCreate, MdSwapCalls } from 'react-icons/md';
import styles from './Icon.module.scss';

interface IconProps {
  children?: React.ReactNode;
  spinOnClick?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  noBorder?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}


const Icon: React.FC<IconProps> = ({ spinOnClick = false, onClick, children, preventDefault = false, stopPropagation = false, noBorder = false }) => {
  const [iconAnimated, setIconAnimated] = useState(false);

  const handleIconClick = (e: React.MouseEvent) => {
    if (preventDefault) e.preventDefault();
    if (stopPropagation) e.stopPropagation();
    if (onClick) onClick(e);
    if (spinOnClick) {
      setIconAnimated(true);
      setTimeout(() => {
        setIconAnimated(false);
      }, 500);
    }

  };

  return (
    <p className={`${styles.icon} ${iconAnimated && spinOnClick ? styles.iconAnimated : ''} ${noBorder ? styles.noBorder : ''}`} onClick={handleIconClick}>
      {children ? children : <MdCreate />}
    </p>
  );
};

export default Icon;
