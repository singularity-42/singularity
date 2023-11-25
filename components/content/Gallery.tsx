
import useInstagramImages from '@/hooks/useInstagramImages';
import styles from './Gallery.module.scss';

interface GalleryProps {
    images: string[];
    name: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, name }) => {
    const imageList = useInstagramImages("drumni");

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className={styles.imageGallery}>
            <div className={styles.largeImageContainer}>
                <img src={images[0]} alt={name} className={styles.largeImage} />
            </div>
            <div className={styles.smallImagesContainer}>
                {images.slice(1, 4).map((image, index) => (
                    <img key={index} src={image} alt={name} className={styles.smallImage} />
                ))}
            </div>
        </div>
    );
};

export default Gallery;