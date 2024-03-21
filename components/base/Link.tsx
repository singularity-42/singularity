"use client";

import React, { useEffect, useState } from "react";
import styles from './Link.module.scss';
import { useEntityOverlay } from "@/hooks/useEntityOverlay";

interface HoverLinkProps {
    name?: string;
    href?: string;
    children: React.ReactNode;
}

const Link: React.FC<HoverLinkProps> = ({ name = '', href = '', children }) => {

    const [actualName, setActualName] = useState<string>(name);
    const { setName, toggleVisibility, visible } = useEntityOverlay(); 

    useEffect(() => {
        // name is a path to a file so we need to convert it to a file name
        const path = name.split(/\\|\//);
        const fileName = path[path.length - 1];
        setActualName(fileName);
    }, [name]);

    return (
        <button
            className={styles.link}
            onMouseDown={(e : React.MouseEvent) => {
                e.preventDefault();
                if (href) {
                    window.open(href, '_blank');
                }
                setName(name);
                if (!visible) {
                    window.history.pushState({}, '', `${window.location.pathname}#${actualName}`);
                } else {
                    window.history.pushState({}, '', `${window.location.pathname}`);
                }
                toggleVisibility();
            }}
            onClick={(e: React.MouseEvent) => {
                // Stop the propagation of the click event to the parent elements
                e.stopPropagation();
            }}
        >
            {children}
        </button>
    );
}

export default Link;
