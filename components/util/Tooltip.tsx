import React, { useEffect, useState } from "react";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
  tooltip: string;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {
  let [name, description] = tooltip.split(" - ");

  if (!description) {
    description = name;
    name = "";
  }

  // State to track the changing state
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    // Set changing to true when tooltip changes
    setChanging(true);

    // Reset changing after the animation duration
    const timeout = setTimeout(() => {
      setChanging(false);
    }, 300);

    // Clear the timeout on component unmount or when the tooltip changes
    return () => clearTimeout(timeout);
  }, [tooltip]);

  return (
    <div
      className={`${styles.tooltip} ${changing ? styles.changing : ""}`}
      onAnimationIteration={() => setChanging(false)}
    >
      <div className={styles.name}>
        <b>{name}</b>
      </div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default Tooltip;
