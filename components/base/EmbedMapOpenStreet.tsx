import React from 'react';
import styles from './EmbedMapOpenStreet.module.scss';

interface MapProps {
 location?: string;
}

const EmbedMapOpenStreet: React.FC<MapProps> = ({ location }) => {
 const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];

 return (
   <div className={styles.map}>
     {lat && long && (
       <div className={styles.mapContainer}>
         <iframe
           src={`https://www.openstreetmap.org/export/embed.html?bbox=${long}%2C${lat}%2C${long}%2C${lat}&layer=mapnik&marker=${lat}%2C${long}`}
           width="100%"
           height="100%"
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
   </div>
 );
};

export default EmbedMapOpenStreet;