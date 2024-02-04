
import useInstagram from '@/hooks/useInstagram';
import styles from './Gallery.module.scss';
import Image from 'next/image';

interface GalleryProps {
    name: string;
}

const Gallery: React.FC<GalleryProps> = ({ name }) => {
    const { images } = useInstagram(name);

    if (!images || images.length === 0) {
        return null;
    }

    // Cross-Origin-Resource-Policy
    if (images && images.length > 0)
        return (
            <div className={styles.imageGallery}>
                <div className={styles.largeImageContainer}>
                    <img src={images[0]} alt={name} className={styles.largeImage} />
                </div>
                {images && images.length > 4 ? <div className={styles.smallImagesContainer}>
                    {images.slice(1, 4).map((image, index) => (
                        <Image key={index} src={image} alt={name} width={100} height={100} className={styles.smallImage} />
                    ))}
                </div> : null}
            </div>
        );
    else return null;
};

export default Gallery;