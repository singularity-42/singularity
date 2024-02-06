import { useState, useEffect } from 'react';

interface UseImageWithFallbackResult {
  imgSrc: string;
}

const useImageWithFallback = (name: string): UseImageWithFallbackResult => {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const imageUrl = `http://localhost:3000/api/collection?name=${encodeURIComponent(name)}`;
    const img = new Image();

    img.src = imageUrl;
    setImgSrc(imageUrl);
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };

  }, [name]);

  return { imgSrc };
};

export default useImageWithFallback;
