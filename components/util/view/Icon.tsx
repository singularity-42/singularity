import { FC } from 'react';
import styles from '@/styles/Icon.module.scss';

// Icons are inside public/icons
const ICON_PATH = "/icons";

type IconProps = {
    name: string;
    size?: number;
    inverted?: boolean;
};

const Icon: FC<IconProps> = ({ name, size = 24, inverted = false }) => {
    const iconPath = `${ICON_PATH}/${name}.svg`;
    console.log(iconPath);
    return (
        <img
            className={`${styles.icon} ${!inverted ? styles.inverted : ""}`}
            src={iconPath}
            alt={name}
            width={size}
            height={size}
        />
    );
}

export default Icon;
