import React, { useEffect, useState } from 'react';

type AdBlockDetectorProps = {
    onAdBlockDetected: () => void;
};

const AdBlockDetector: React.FC<AdBlockDetectorProps> = ({ onAdBlockDetected }) => {
    const [adBlockDetected, setAdBlockDetected] = useState(false);

    useEffect(() => {
        const bait = document.createElement('div');
        bait.setAttribute('class', 'advert');
        bait.style.display = 'none';
        bait.setAttribute('id', 'adblock-test');
        document.body.appendChild(bait);

        setTimeout(() => {
            setAdBlockDetected(document.getElementById('adblock-test') === null);
            if (adBlockDetected) {
                onAdBlockDetected();
            }
            document.body.removeChild(bait);
        }, 50);
    }, [onAdBlockDetected, adBlockDetected]);

    return null;
};

export default AdBlockDetector;