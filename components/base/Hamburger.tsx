import React from "react";
import styles from "./Hambruger.module.scss";

interface HambugerProps {
  menuOpen?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const Hambuger: React.FC<HambugerProps> = ({ menuOpen = false, onClick, disabled = false }) => {
  const handleMenuClick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  return (
    <div
      className={`${styles.hamburger} ${menuOpen ? styles.show : ""}`}
      onClick={handleMenuClick}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Hambuger;
