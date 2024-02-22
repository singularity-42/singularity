import React, { useState } from 'react';
import styles from './ListSocials.module.scss';
import Social, { SocialMedia } from '../util/Social';

interface ListSocialsProps {
    metadata?: any;
    editing?: boolean;
    onChange?: (metadata: any) => void;
}

const Socials: React.FC<ListSocialsProps> = ({ metadata = {}, editing, onChange }) => {
    const [addingSocial, setAddingSocial] = useState(false);
    const [newSocialLink, setNewSocialLink] = useState('');
    
    const handleAddSocialClick = () => setAddingSocial(true);
    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewSocialLink(e.target.value);
    const handleSocialLinkBlur = () => setAddingSocial(false);
    const handleAddSocialClickRemove = ( socialMedia: SocialMedia ) => {
        const updatedMetadata = { ...metadata };
        delete updatedMetadata[socialMedia];
        if (onChange) onChange(updatedMetadata);
        setAddingSocial(false);
    };

    const handleSocialLinkKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') if (newSocialLink) {
                let rootDomainParts = (new URL(newSocialLink))?.hostname?.split('.') || [];
                if (rootDomainParts.length > 2) rootDomainParts = rootDomainParts.slice(1);
                const updatedMetadata = { ...metadata, [rootDomainParts[0]]: newSocialLink };
                if (onChange) onChange(updatedMetadata);
                setNewSocialLink('');
                setAddingSocial(false);
            }
        
    };

    return (
        <div className={styles.listSocials}>
            {Object.keys(metadata || {}).map((key, index) => {
                // check if is array than skip
                if (Array.isArray(metadata[key])) return null;
                
                return (
                <Social key={`${index}`} socialMedia={key as SocialMedia} username={metadata[key] || ''} onClick={ editing ? () => handleAddSocialClickRemove(key as SocialMedia) : undefined } />
            )})}
            {editing && (
                <>
                    {addingSocial ? (
                        <input
                            className={styles.addSocialInput}
                            type="text"
                            value={newSocialLink}
                            onChange={handleSocialLinkChange}
                            onBlur={handleSocialLinkBlur}
                            onKeyPress={handleSocialLinkKeyPress}
                            placeholder="Enter social media link"
                        />
                    ) : (
                        <Social
                            key="virtual-social"
                            socialMedia={SocialMedia.add}
                            username={'+'}
                            onClick={handleAddSocialClick}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Socials;
