import React from "react";
import styles from "./Until.module.scss";

interface DaysUntilProps {
    date: string;
  }
  
  const Until: React.FC<DaysUntilProps> = ({ date = "2021-01-01" }) => {
    const today = new Date();
    const dateParts = date.split("-");
    const dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
    const timeDiff = dateObject.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
    if (diffDays == 0) return <div className={styles.daysUntil}>Heute</div>;
    if (diffDays == 1) return <div className={styles.daysUntil}>Morgen</div>;
    if (diffDays == 2) return <div className={styles.daysUntil}>Übermorgen</div>;
    if (diffDays < 0) return <div className={styles.daysUntil}>Vor {diffDays * -1} Tagen</div>;
    return <div className={styles.daysUntil}>In {diffDays} Tagen</div>;
  };

  export default Until;