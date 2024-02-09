import React from "react";
import styles from "./Menu.module.scss";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useDetails } from "@/hooks/provider/DetailsProvider";
import { MdGroups, MdOutlineCalendarMonth, MdOutlineEditNote, MdPages, MdPerson } from "react-icons/md";
import { TYPE_DESCRIPTIONS } from "@/types";

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ open, onClose }) => {
  const { visible, toggleVisibility, setName } = useDetails();
  const [lastClicked, setLastClicked] = React.useState("");

  const handleLinkClick = (str: string) => {
    if (visible){ setName(''); toggleVisibility();}
    setLastClicked(str);
    // wait 420ms and then close the menu
    setTimeout(() => {
      onClose();
    }, 420);
  };

  const getCurrentPage = (path: string) => {
    // const currentPath = window.location.pathname;
    const pathname = usePathname();
    // collaborations is also availbe for / root as selected in dev and prod for some versions TODO: fix this and add real home page
    if (pathname === "/" && path === "/collaborations") return styles.selected;
    return pathname === path ? styles.selected : styles.notSelected;
  };

  let isMenuOpen = open === true ? styles.show : "";

  const pages = Object.keys(TYPE_DESCRIPTIONS).map((type: string) => {
    return `/${type}`;
  });
 
  const pageIcons: { [key: string]: JSX.Element } = {
    "/collaborations": <MdOutlineCalendarMonth />,
    "/collectives": <MdGroups />,
    "/creatives": <MdPerson />,
    "/concepts": <MdPages />,
    // "/contact": <MdPerson />,
    "/changes": <MdOutlineEditNote />,
    
  };

  return (
    <ul className={`${styles.menu} ${isMenuOpen}`}>
      {
        pages.map((page, index) => {
          let innerText = page.replace("/", "");
          return (
            <li key={index} className={`${styles.menuItem} ${getCurrentPage(page)}`}>
              <Link href={page} className={styles.menuLink} onClick={() => handleLinkClick(page)}>
                {innerText}
                <div className={styles.icon}>
                  {pageIcons[page]}
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
