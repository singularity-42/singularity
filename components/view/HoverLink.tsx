"use client";

import React, { useEffect, useState } from "react";
import styles from './HoverLink.module.scss';
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface HoverLinkProps {
    name?: string;
    href?: string;
    openInNewTab?: boolean; // Added prop to control opening in a new tab
    children: React.ReactNode;
}

const HoverLink: React.FC<HoverLinkProps> = ({ name = '', href = '', openInNewTab = false, children }) => {

    const [actualName, setActualName] = useState<string>(name);
    const { setName, toggleVisibility, visible } = useDetails(); 

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
                    // Open in a new tab if specified
                    if (openInNewTab) {
                        window.open(href, '_blank');
                        return;
                    }
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

export default HoverLink;
