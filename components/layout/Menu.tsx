import React from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";
import UserInfo from "../function/UserInfo";
import { usePathname } from 'next/navigation';
import { useDetails } from "@/hooks/provider/DetailsProvider";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ open, onClose }) => {
  const { visible, toggleVisibility } = useDetails();
  
  const handleLinkClick = () => {
    if (visible) toggleVisibility();
    
    // wait 420ms and then close the menu
    setTimeout(() => {
      onClose();
    }, 420);
  };




  const getCurrentPage = (path: string) => {
    // const currentPath = window.location.pathname;
    const pathname = usePathname();
    return pathname === path ? styles.selected : styles.notSelected;
  };

  let isMenuOpen = open === true ? styles.show : "";

  
  const pages = [
    "/collaborations",
    "/collectives",
    "/cyberware",
    "/concepts",
    "/creatives",  
    "/change",
    // "/creations",
    //   "/creators",
    // "/canvas",
    // "/culture",
    // "/curation",
    // "/cats",
    // "/coffe",
    // "/comedy",
  ];

  return (
    <ul className={`${styles.menu} ${isMenuOpen}`}>
       {
        pages
        // .sort((a, b) => 
        //   {
        //     if (a.length > b.length) {
        //       return -1;
        //     }
        //     if (a.length < b.length) {
        //       return 1;
        //     }
        //     return 0;
        //   }
        // )
        .map((page, index) => {
          let innerText = page.replace("/", "");
          return (
            <li key={index} className={`${styles.menuItem} ${getCurrentPage(page)}`}>
              <Link href={page} className={styles.menuLink} onClick={handleLinkClick}>
                {innerText}
              </Link>
            </li>
          )
        })
       }
    </ul>
  );
};

export default Menu;
