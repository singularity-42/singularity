"use client"

import React, { useState } from "react";
import styles from "./Hambruger.module.scss";

interface HambugerProps {
  menuOpen: boolean;
  onClick: () => void;
}

const Hambuger: React.FC<HambugerProps> = ({ menuOpen, onClick }) => {

  const handleMenuClick = () => {
    onClick();
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
