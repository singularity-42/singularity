import React from 'react';
import styles from './Map.module.scss';

interface MapProps {
 location?: string;
}

const Map: React.FC<MapProps> = ({ location }) => {
 const [lat, long] = location?.split(',').map((s: string) => parseFloat(s)) || [null, null];

 return (
   <div className={styles.map}>
     {lat && long && (
       <div className={styles.mapContainer}>
         <iframe
         // https://www.openstreetmap.org/export/embed.html?bbox=15.417423248291016%2C48.54885900556121%2C15.431585311889647%2C48.55517964627281&layer=mapnik&marker=48.55201942461214%2C15.424504280090332
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

export default Map;