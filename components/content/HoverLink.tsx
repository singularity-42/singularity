// HoverLink.tsx

import React, { use, useEffect, useState } from "react";
import styles from './HoverLink.module.scss';
import useEntity from "@/hooks/useEntity";
import Tags from "../layout/Tags";
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface HoverLinkProps {
    name: string;
    children: React.ReactNode;
}

const HoverLink: React.FC<HoverLinkProps> = ({ name, children }) => {

    const { setName, visible, toggleVisibility } = useDetails(); 

    return (
        <div className={styles.hoverLink}>
            <button
                className={styles.link}
                onMouseDown={() => {
                    setName(name);
                    window.history.pushState({}, '', `${window.location.pathname}#${name}`);
                    toggleVisibility();
                }}
            >
                {children}
            </button>
        </div>
    );
}

export default HoverLink;
