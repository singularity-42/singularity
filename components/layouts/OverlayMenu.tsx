import React from "react";
import styles from "./OverlayMenu.module.scss";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEntityOverlay } from "@/hooks/useEntityOverlay";
import { useFilter } from "@/hooks/useFilter";
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS } from "@/app/defaults";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ open, onClose }) => {
  const { visible, toggleVisibility, setName } = useEntityOverlay();
  const [lastClicked, setLastClicked] = React.useState("");
  const { setFilterCategory } = useFilter();

  const handleLinkClick = (str: string) => {
    if (visible){ setName(''); toggleVisibility();}
    setLastClicked(str);
    setTimeout(() => {
      onClose();
    }, 42);
  };

  const getCurrentPage = (path: string) => {
    const pathname = usePathname();
    return pathname === path ? styles.selected : styles.notSelected;
  };

  let isMenuOpen = open === true ? styles.show : "";

  const categoriesList = Object.keys(CATEGORY_DESCRIPTIONS).map((type: string) => {
    return `/${type}`;
  });

  return (
    <ul className={`${styles.menu} ${isMenuOpen}`}>
      {
        categoriesList.map((page, index) => {
          let innerText = page.replace("/", "");
          let icon = CATEGORY_ICONS[innerText];
          return (
            <li key={index} className={`${styles.menuItem} ${getCurrentPage(page)}`}>
              <Link href={page} className={styles.menuLink} onClick={() => handleLinkClick(page)}>
                {innerText}
                <div className={styles.icon}>
                  {icon}
                </div>
              </Link>
            </li>
          )
        })
      }
    </ul>
  );
};

export default Menu;
