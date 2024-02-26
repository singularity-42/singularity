import React, { useState } from 'react';
import EntitiyCard from './EntityCard';
import styles from './EntityCardCarousel.module.scss';
import Slider from '../util/Slider';
import { MdArrowForward, MdArrowBack } from 'react-icons/md'; // Import MD icons

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
          <EntitiyCard
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
