"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Menu from "../util/Menu";
import styles from "./Content.module.scss";
import Hamburger from "./Hamburger";
import { useVisual } from "@/hooks/provider/VisualProvider";
import Tooltip from "../util/Tooltip";
import Title from "./Title";
import { useEntitiy } from "@/hooks/provider/EntitiyProvider";
import Background from "./Background";
import { Lock } from "../data/CredentialsOverlay";
import Entities from "../data/Entities";


const Content = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const { visible, toggleVisibility } = useEntitiy();
  const context = useVisual();

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
        <Tooltip tooltip={context?.tooltip} />
        <Hamburger onClick={handleHamburgerClick} menuOpen={menuOpen} />
        <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </nav>
      <main className={styles.main}>
        <Entities />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footer__left}>
          <Lock />
        </div>
        <div className={styles.footer__right}>
          <Link href="/collectives#Singularity">
            Impressum
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Content;
