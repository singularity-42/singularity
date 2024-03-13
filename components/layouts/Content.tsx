"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import styles from "./Content.module.scss";
import Hamburger from "../base/Hamburger";
import { useVisual } from "@/hooks/provider/useVisual";
import Title from "../base/Title";
import { useEntityOverlay } from "@/hooks/provider/useEntityOverlay";
import Background from "../base/Background";
import ListEntities from "../collections/ListEntities";
import Menu from "./OverlayMenu";
import { MdFeedback, MdInfo } from "react-icons/md";

interface Props {
  children: React.ReactNode;
}


const GlobalContent = (props: Props) => {
  const { children } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const { visible, toggleVisibility } = useEntityOverlay();
  const { tooltip } = useVisual();

  const handleHamburgerClick = useCallback(() => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  }, []);

  const handleScroll = useCallback(() => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);

    if (currentPosition >  0 && !isShrunk) {
      setIsShrunk(true);
    } else if (currentPosition ===  0 && isShrunk) {
      setIsShrunk(false);
    }
  }, [isShrunk]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleTitleClick = useCallback(() => {
    setMenuOpen(false);
    if (visible) toggleVisibility();
    if (scrollPosition ===  0) window.location.href = "/";
    else window.scrollTo({ top:  0, behavior: "smooth" });
  }, [toggleVisibility]);

  return (
    <div className={styles.content}>
      <Background />
      <nav className={`${styles.header} ${isShrunk ? styles.shrink : ""}`}>
        <Title onClick={handleTitleClick} />
        <div className={styles.tooltip}>
          <p className={styles.name}>{tooltip.split('-')[0]}</p>
          <p className={styles.description}>{tooltip.split('-')[1]}</p> 
        </div>
        <Hamburger onClick={handleHamburgerClick} menuOpen={menuOpen} />
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </nav>
      <main className={styles.main}>
        {children}
        <ListEntities />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footer__left}>
          <Link href="/changes#Feedback">
            <MdFeedback />
          </Link>
        </div>
        <div className={styles.footer__right}>
          <Link href="/collectives#Singularity">
            <MdInfo />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default GlobalContent;
