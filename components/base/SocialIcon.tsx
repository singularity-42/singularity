import React from 'react';
import { FaInstagram, FaYoutube, FaSoundcloud, FaSpotify, 
    // FaBeatport, @TODO: Uncomment when the icons are available 
FaBandcamp, FaTelegramPlane, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone, FaGlobeEurope } from 'react-icons/fa';

interface SocialIconProps {
    name: string;
    size?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ name, size }) => {
  switch (name) {
    case 'instagram':
      return <FaInstagram size={size} />;
    case 'youtube':
      return <FaYoutube size={size} />;
    case 'soundcloud':
      return <FaSoundcloud size={size} />;
    case 'spotify':
      return <FaSpotify size={size} />;
    case 'beatport':
      return <FaBandcamp size={size} />;
    case 'bandcamp':
      return <FaBandcamp size={size} />;
    case 'telegram':
      return <FaTelegramPlane size={size} />;
    case 'twitter':
      return <FaTwitter size={size} />;
    case 'mail':
      return <FaEnvelope size={size} />;
    case 'address':
      return <FaMapMarkerAlt size={size} />;
    case 'tel':
      return <FaPhone size={size} />;
    default:
      return <FaGlobeEurope size={size} />;
  }
};

export default SocialIcon;
