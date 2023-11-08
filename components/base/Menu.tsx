import React from "react";
import styles from "@/styles/Menu.module.scss";
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
      <li className={`${styles.menuItem} ${getCurrentPage("/thebox")} ${styles.theBox}`}>
        <Link href="/creatives" className={styles.menuLink} onClick={handleLinkClick}>
          Creatives
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/about")}`}>
        <Link href="/concepts" className={styles.menuLink} onClick={handleLinkClick}>
          Concepts
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/video")}`}>
        <Link href="/collaborations" className={styles.menuLink} onClick={handleLinkClick}>
          Collaborations
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/jukebox")}`}>
        <Link href="/collectives" className={styles.menuLink} onClick={handleLinkClick}>
          Collectives
        </Link>
      </li>
      {/* <li className={`${styles.menuItem} ${styles.navFooter}`}>
        <UserInfo menuOpen={open} />
      </li> */}
    </ul>
  );
};

export default Menu;
