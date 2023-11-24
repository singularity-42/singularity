// HoverLink.tsx

import React, { use, useEffect, useState } from "react";
import styles from './HoverLink.module.scss';
import useEntity from "@/hooks/useEntity";
import Tags from "../layout/Tags";

interface HoverLinkProps {
    name: string;
    children: React.ReactNode;
}

const HoverLink: React.FC<HoverLinkProps> = ({ name, children }) => {

    return (
        <div className={styles.hoverLink}>
            <button
                className={styles.link}
                onMouseDown={() => {
                    window.history.pushState({}, '', `${window.location.pathname}#${name}`);
                }}
            >
                {children}
            </button>
        </div>
    );
}

export default HoverLink;
