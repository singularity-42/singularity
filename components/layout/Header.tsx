"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Menu from "./Menu";
import styles from "./Header.module.scss";
import Hamburger from "../base/Hamburger";
import { useTooltip } from "@/hooks/provider/TooltipProvider";
import Tooltip from "./Tooltip";
import Title from "../base/Title";
import { useDetails } from "@/hooks/provider/DetailsProvider";

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isShrunk, setIsShrunk] = useState(false);
  const { visible, toggleVisibility } = useDetails();

  const context = useTooltip();

  const handleHamburgerClick = useCallback(() => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  }, []);

  const handleScroll = useCallback(() => {
    const currentPosition = window.pageYOffset;
    setScrollPosition(currentPosition);

    if (currentPosition > 0 && !isShrunk) {
      setIsShrunk(true);
    } else if (currentPosition === 0 && isShrunk) {
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
    // send to top of page
    // if is top of page, don't scroll insted send to root url
    if (scrollPosition === 0) window.location.href = "/";
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [toggleVisibility]);

  return (
    <nav className={`${styles.header} ${isShrunk ? styles.shrink : ""}`}>
      <Title onClick={handleTitleClick} />
      <Tooltip tooltip={context?.tooltip} />
      <Hamburger onClick={handleHamburgerClick} menuOpen={menuOpen} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  );
};

export default Header;
