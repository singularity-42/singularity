
import useInstagramImages from '@/hooks/useInstagramImages';
import styles from '@/styles/Entity.module.scss';

interface ImageGalleryProps {
    images: string[];
    name: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name }) => {
    const imageList = useInstagramImages("drumni");

    return (
        <div className={styles.imageGallery}>
            {/* <div className={styles.largeImageContainer}>
                <img src={images[0]} alt={name} className={styles.largeImage} />
            </div>
            <div className={styles.smallImagesContainer}>
                {images.slice(1, 4).map((image, index) => (
                    <img key={index} src={image} alt={name} className={styles.smallImage} />
                ))}
            </div> */}
        </div>
    );
};

export default ImageGallery;