// HoverLink.tsx

import React, { use, useEffect, useState } from "react";
import styles from './HoverLink.module.scss';
import useEntity from "@/hooks/useEntity";
import Tags from "../layout/collections/Tags";
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface HoverLinkProps {
    name?: string;
    href?: string;
    children: React.ReactNode;
}

const HoverLink: React.FC<HoverLinkProps> = ({ name = '', href = '', children }) => {

    const [ actualName, setActualName ] = useState<string>(name);
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
                onMouseDown={() => {
                    if (href) {
                        window.open(href, '_blank');
                        return;
                    }
                    setName(name);
                    if (!visible) {
                    window.history.pushState({}, '', `${window.location.pathname}#${actualName}`);
                    }else{
                        window.history.pushState({}, '', `${window.location.pathname}`);
                    }
                    toggleVisibility();
                }}
            >
                {children}
            </button>
    );
}

export default HoverLink;
