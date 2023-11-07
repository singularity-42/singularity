// Menu.tsx

import React from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";
// import UserInfo from "../common/global/UserInfo";
import { useRouter } from "next/router";
import Image from "next/image";
import Button, { ButtonType } from "@/components/util/Button";
import UserInfo from "../auth/UserInfo";

interface MenuProps {
  themeToggler: () => void;
  theme: string;
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ themeToggler, theme, open, onClose }) => {
  const handleLinkClick = () => {
    // Call the onClose function to close the header
    onClose();
  };

  const getCurrentPage = (path: string) => {
    const currentPath = "video";
    return currentPath === path ? styles.currentSelected : "";
  };

  let isMenuOpen = open === true ? styles.show : "";
  return (
    <ul className={`${styles.menu} ${isMenuOpen}`}>
      <li className={`${styles.menuItem} ${getCurrentPage("/video")}`}>
        <Link href="/video" className={styles.menuLink} onClick={handleLinkClick}>
          Video
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/jukebox")}`}>
        <Link href="/jukebox" className={styles.menuLink} onClick={handleLinkClick}>
          Jukebox
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/about")}`}>
        <Link href="/about" className={styles.menuLink} onClick={handleLinkClick}>
          About
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/thebox")} ${styles.theBox}`}>
        <Link href="/thebox" className={styles.menuLink} onClick={handleLinkClick}>
          The Box
        </Link>
      </li>
      <li className={`${styles.menuItem} ${styles.navFooter}`}>
        <UserInfo menuOpen={open} />

        <Button states={[
          {
            type: ButtonType.Round,
            icon_url: "/icons/theme/sun.svg",
            icon_alt: "Light",
            onLeftClickState: "Dark",
          },
          {
            type: ButtonType.Round,
            icon_url: "/icons/theme/moon.svg",
            icon_alt: "Dark",
            onLeftClickState: "Light",
          },
        ]}
          onStateChange={() => {
            themeToggler();
          }}
          isDisabled={false} />
      </li>
    </ul>
  );
};

export default Menu;
