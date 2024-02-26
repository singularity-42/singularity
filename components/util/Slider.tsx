// Slider.tsx
import React from "react";
import styles from './Slider.module.scss';
import { MdArrowLeft, MdArrowRight } from "react-icons/md";

interface SliderProps {
  children: React.ReactNode;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

const Slider: React.FC<SliderProps> = ({ children, currentIndex, setCurrentIndex, total }) => {
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex +  1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex -  1 + total) % total);
  };

  return (
    <div className={styles.slider_container}>
      <div className={styles.slider_items} style={{ transform: `translateX(-${currentIndex *  100}%)` }}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className={styles.slide}>
            {child}
          </div>
        ))}
      </div>
      <button className={`${styles.navigationButton} ${styles.left}`} onClick={prevSlide}>
        <MdArrowLeft />
      </button>
      <button className={`${styles.navigationButton} ${styles.right}`} onClick={nextSlide}>
        <MdArrowRight />
      </button>
    </div>
  );
};

export default Slider;
