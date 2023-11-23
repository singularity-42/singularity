import React from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";
import UserInfo from "../function/UserInfo";
import { usePathname } from 'next/navigation';

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ open, onClose }) => {
  const handleLinkClick = () => {
    // wait 420ms and then close the menu
    setTimeout(() => {
      onClose();
    }, 420);
  };


  const getCurrentPage = (path: string) => {
    // const currentPath = window.location.pathname;
    const pathname = usePathname();
    return pathname === path ? styles.currentSelected : styles.theBox;
  };

  let isMenuOpen = open === true ? styles.show : "";
  return (
    <ul className={`${styles.menu} ${isMenuOpen}`}>
      <li className={`${styles.menuItem} ${getCurrentPage("/collaborations")}`}>
        <Link href="/collaborations" className={styles.menuLink} onClick={handleLinkClick}>
          Collaborations
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/collectives")}`}>
        <Link href="/collectives" className={styles.menuLink} onClick={handleLinkClick}>
          Collectives
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/creatives")} ${styles.theBox}`}>
        <Link href="/creatives" className={styles.menuLink} onClick={handleLinkClick}>
          Creatives
        </Link>
      </li>
      <li className={`${styles.menuItem} ${getCurrentPage("/concepts")}`}>
        <Link href="/concepts" className={styles.menuLink} onClick={handleLinkClick}>
          Concepts
        </Link>
      </li>
      {/* <li className={`${styles.menuItem} ${styles.navFooter}`}>
        <UserInfo menuOpen={open} />
      </li> */}
    </ul>
  );
};

export default Menu;
