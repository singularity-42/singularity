"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "../collections/Menu";
import styles from "./Header.module.scss";
import Hamburger from "../../utils/Hamburger";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import Tooltip from "../../view/Tooltip";
import Title from "../../base/Title";
// import Map from "../function/Map";

type HeaderProps = {
};

const Header: React.FC<HeaderProps> = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isShrunk, setIsShrunk] = useState(false);

    const context = useTooltip();

    const handleHamburgerClick = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.pageYOffset;
            setScrollPosition(currentPosition);

            if (currentPosition > 0 && !isShrunk) {
                setIsShrunk(true);
            } else if (currentPosition === 0 && isShrunk) {
                setIsShrunk(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isShrunk]);

    return (
        <nav className={`${styles.header} ${isShrunk ? styles.shrink : ""}`}>
            <Title />
            <Tooltip tooltip={context?.tooltip} />
            <Hamburger onClick={handleHamburgerClick} menuOpen={menuOpen} />
            <Menu
                open={menuOpen}
                onClose={() => {
                    setMenuOpen(false);
                }}
            />
        </nav>
    );
};

export default Header;
