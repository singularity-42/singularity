import React, { useState } from 'react';
import EntitiyCard from './EntityCard'; // Assuming you have a Card component
import styles from './EntityCardCarousel.module.scss';
import Slider from '../util/Slider';

interface EntityCardCarouselProps {
  files: any[];
  onTagClick: (tag: string) => void;
}

const EntityCardCarousel: React.FC<EntityCardCarouselProps> = ({
  files,
  onTagClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.container} >
      <Slider
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        total={files.length}
      >
        {files.map((file, index) => (
          <EntitiyCard
            key={index}
            file={file}
            onTagClick={onTagClick}
          />
        ))}
      </Slider>
    </div>
  );
};

export default EntityCardCarousel;