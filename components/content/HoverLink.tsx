// HoverLink.tsx

import React, { use, useEffect, useState } from "react";
import styles from './HoverLink.module.scss';
import useEntity from "@/hooks/useEntity";
import Tags from "../layout/Tags";
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface HoverLinkProps {
    name?: string;
    href?: string;
    children: React.ReactNode;
}

const HoverLink: React.FC<HoverLinkProps> = ({ name = '', href = '', children }) => {

    const { setName, toggleVisibility } = useDetails(); 

    return (
            <button
                className={styles.link}
                onMouseDown={() => {
                    if (href) {
                        window.open(href, '_blank');
                        return;
                    }
                    setName(name);
                    window.history.pushState({}, '', `${window.location.pathname}#${name}`);
                    toggleVisibility();
                }}
            >
                {children}
            </button>
    );
}

export default HoverLink;
