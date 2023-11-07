"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "./Menu";
import styles from "./Header.module.scss";
import Hamburger from "../util/Hamburger";

type HeaderProps = {
    themeToggler: () => void;
    theme: string;
};

const Header: React.FC<HeaderProps> = ({ themeToggler, theme }) => {
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
            {/* <a href="/" className={styles.headerBrand} onClick={() => setMenuOpen(false)}>
                Drumni.com
            </a> */}
            <Link href="/" className={styles.headerBrand} onClick={() => setMenuOpen(false)}>
                Drumni.com
            </Link>

            <Hamburger onClick={handleHamburgerClick} menuOpen={menuOpen} />
            <Menu
                open={menuOpen}
                themeToggler={themeToggler}
                theme={theme}
                onClose={() => {
                    setMenuOpen(false);
                }}
            />
        </nav>
    );
};

export default Header;
