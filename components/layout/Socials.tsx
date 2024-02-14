import React, { useState } from 'react';
import styles from './Socials.module.scss';
import Social, { SocialMedia } from '../base/Social';

interface ListSocialsProps {
    metadata?: any;
    editing?: boolean;
    onChange?: (metadata: any) => void;
}

const Socials: React.FC<ListSocialsProps> = ({ metadata = {}, editing, onChange }) => {
    const [addingSocial, setAddingSocial] = useState(false);
    const [newSocialLink, setNewSocialLink] = useState('');

    const handleAddSocialClickRemove = ( socialMedia: SocialMedia ) => {
        const updatedMetadata = { ...metadata };
        delete updatedMetadata[socialMedia];
        if (onChange) {
            onChange(updatedMetadata);
        }
        setAddingSocial(false);
    };

    const handleAddSocialClick = () => {
        setAddingSocial(true);
    };

    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSocialLink(e.target.value);
    };


    const handleSocialLinkBlur = () => {
        setAddingSocial(false);
    };

    const handleSocialLinkKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log(newSocialLink, "sadasd");
            if (newSocialLink) {
                const url = new URL(newSocialLink);
                let rootDomainParts = url?.hostname?.split('.') || [];
                // we want from www.text.com -> text
                if (rootDomainParts.length > 2) {
                    rootDomainParts = rootDomainParts.slice(1);
                }
                const rootDomain = rootDomainParts[0];
                console.log(rootDomain, "rootDomain");
                const updatedMetadata = { ...metadata, [rootDomain]: newSocialLink };
                console.log(updatedMetadata);
                if (onChange) {
                    onChange(updatedMetadata);
                }
                setNewSocialLink('');
                setAddingSocial(false);
            }
        }
    };

    return (
        <div className={styles.listSocials}>
            {Object.keys(metadata || {}).map((key, index) => (
                <Social key={`${index}`} socialMedia={key as SocialMedia} username={metadata[key] || ''} onClick={ editing ? () => handleAddSocialClickRemove(key as SocialMedia) : undefined } />
            ))}
            {

            }
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
                            socialMedia={SocialMedia.add} // Placeholder value, you can change it as needed
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
