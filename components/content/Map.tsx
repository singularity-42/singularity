// EntityMap.tsx
import React from 'react';
import styles from '../layout/Entity.module.scss';

interface MapProps {
  location?: string;
}

const Map: React.FC<MapProps> = ({ location }) => {
  const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];

  return (
    <>
      {lat && long && (
        <div className={styles.mapContainer}>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${long}%2C${lat}%2C${long}%2C${lat}&amp;layer=mapnik&amp;marker=${lat}%2C${long}`}
            width="77%"
            height="20%"
            frameBorder="0"
            style={{
              border: 0,
              filter: 'grayscale(100%) invert(100%)',
            }}
            allowFullScreen={false}
            aria-hidden="false"
            tabIndex={0}
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Map;
