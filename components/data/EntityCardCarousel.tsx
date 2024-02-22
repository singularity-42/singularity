import React, { useState, useRef } from 'react';
import styles from './EntityCardCarousel.module.scss';
import Card from './EntityCard'; // Assuming you have a Card component

interface EntityCardCarouselProps {
  files: any[];
  onTagClick: (tag: string) => void;
  responsive?: { [key: string]: number }; // Define responsive breakpoints here
}

const EntityCardCarousel: React.FC<EntityCardCarouselProps> = ({
  files,
  onTagClick,
  responsive,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % files.length;
    setCurrentIndex(nextIndex);
    carouselRef.current!.scroll({
      left: nextIndex * carouselRef.current!.offsetWidth,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    const prevIndex = currentIndex === 0 ? files.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    carouselRef.current!.scroll({
      left: prevIndex * carouselRef.current!.offsetWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="carousel" ref={carouselRef}>
      {files.map((file, index) => (
        <div key={`card-${index}`} className={styles.cardWrapper}>
          <Card file={file} onTagClick={onTagClick} />
        </div>
      ))}
      {files.length > 1 && (
        <div className="carousel__buttons">
          <button className="carousel__button" onClick={handlePrev}>Prev</button>
          <button className="carousel__button" onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default EntityCardCarousel;
