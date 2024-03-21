import React, { useState } from 'react';
import EntityCard from './EntityCard';
import styles from './EntityCardCarousel.module.scss';
import Slider from '../base/Slider';
import useEntities from '@/hooks/useEntities';

interface EntityCardCarouselProps {}

const EntityCardCarousel: React.FC<EntityCardCarouselProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { files } = useEntities();

  return (
    <div className={styles.container}>
      <Slider
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        total={files.length}
      >
        {files.map((file, index) => (
          <EntityCard
            key={index}
            file={file}
            className={styles.cardWrapper} // Add class to card wrapper
          />
        ))}
      </Slider>
    </div>
  );
};

export default EntityCardCarousel;
