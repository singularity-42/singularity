import React, { useEffect } from "react";
import styles from "./Button.module.scss";
import Image from "next/image";

enum ButtonType {
    Round = 'round',
    Square = 'square',
    Circle = 'circle',
}

type ButtonState = {
    icon_url: string;
    icon_alt: string;
    type: ButtonType;

    onLeftClickState?: string;
    onRightClickState?: string;
    onClick?: () => void;
    onContextMenu?: () => void;
}

interface ButtonProps {
    states: ButtonState[];
    onStateChange?: (state: ButtonState) => void;
    isDisabled?: boolean;
    forcedState?: string;
}

const Button: React.FC<ButtonProps> = ({ states, onStateChange, isDisabled, forcedState }) => {
    const [state, setState] = React.useState<ButtonState>(states[0]);

    const handleClick = () => {
        if (isDisabled) {
            return;
        }

        const nextState = getButtonStateByAlt(state.onLeftClickState || state.icon_alt) || states[0];
        setState(nextState);
        state.onClick && state.onClick();
        if (onStateChange) {
            onStateChange(nextState);
        }
    }

    useEffect(() => {
        if (forcedState) {
            const nextState = getButtonStateByAlt(forcedState) || states[0];
            setState(nextState);
            if (onStateChange) {
                onStateChange(nextState);
            }
        }
    }, [forcedState]);


    const getButtonStateByAlt = (alt: string): ButtonState | undefined => {
        return states.find((state) => state.icon_alt === alt);
    }


    const getButtonClass = (state: ButtonState) => {
        switch (state.type) {
            case ButtonType.Round:
                return styles.round;
            case ButtonType.Square:
                return styles.square;
            case ButtonType.Circle:
                return styles.circle;
        }
    }

    const getButtonIcon = (state: ButtonState) => {
        return (
            <Image
                src={state.icon_url}
                alt={state.icon_alt}
                width={20}
                height={20}
            />
        );
    }

    const getButton = (state: ButtonState) => {
        return (
            <button
                className={`${styles.button} ${getButtonClass(state)}`}
                onClick={handleClick}
                disabled={isDisabled}
            >
                {getButtonIcon(state)}
            </button>
        );
    }

    return (
        <div className={styles.buttonContainer}>
            {forcedState ? getButton(getButtonStateByAlt(forcedState) || states[0]) : getButton(state)}
        </div>
    );
}

export default Button;
export { ButtonType };