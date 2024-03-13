import React, { useState } from 'react';
import EntityCard from './EntityCard';
import styles from './EntityCardCarousel.module.scss';
import { MdArrowForward, MdArrowBack } from 'react-icons/md'; // Import MD icons
import Slider from '../base/Slider';

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
            onTagClick={onTagClick}
            className={styles.cardWrapper} // Add class to card wrapper
          />
        ))}
      </Slider>
    </div>
  );
};

export default EntityCardCarousel;
