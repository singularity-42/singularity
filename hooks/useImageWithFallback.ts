import { useState, useEffect } from 'react';

interface UseImageWithFallbackResult {
  imgSrc: string;
}

const useImageWithFallback = (name: string): UseImageWithFallbackResult => {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}collection?name=${encodeURIComponent(name)}`;
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
