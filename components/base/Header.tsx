"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "./Menu";
import styles from "@/styles/Header.module.scss";
import Hamburger from "../util/event/Hamburger";
import Map from "../util/event/Map";

type HeaderProps = {
};

const Header: React.FC<HeaderProps> = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isShrunk, setIsShrunk] = useState(false);

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
            <Link href="/" className={styles.headerBrand} onClick={() => setMenuOpen(false)}>Singularity</Link>

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

