import React from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";
import UserInfo from "../auth/UserInfo";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ open, onClose }) => {
  const handleLinkClick = () => {
    onClose();
  };

  const getCurrentPage = (path: string) => {
    const currentPath = "video";
    return currentPath === path ? styles.currentSelected : styles.theBox;
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
      {/* <li className={`${styles.menuItem} ${styles.navFooter}`}>
        <UserInfo menuOpen={open} />
      </li> */}
    </ul>
  );
};

export default Menu;
