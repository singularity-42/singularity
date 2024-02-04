import React from "react";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
    tooltip: string;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip }) => {

    let [ name, description ] = tooltip.split(" - ");

    if (!description) {
        description = name;
        name = "";
    }

    return (
        <div className={styles.tooltip}>
            <div className={styles.name}><b>{name}</b></div>
            <div className={styles.description}>{description}</div>
        </div>
    );
};

export default Tooltip;