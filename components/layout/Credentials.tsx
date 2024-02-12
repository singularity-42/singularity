import { useAuth } from '@/hooks/useAuth';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Credentials.module.scss';
import { MdAdd, MdClose } from 'react-icons/md';

// Credentials component
const Credentials: React.FC = () => {
  const { toggleOverlay, visible, coveredCredentials, addCredentials, removeCredentials } = useAuth();
  const [newCredential, setNewCredential] = useState('');

  const handleAddCredential = useCallback(() => {
    addCredentials(newCredential);
    setNewCredential('');
  }, [newCredential]);

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`}>
      <div className={styles.Credentials}>
        <div className={styles.header}>
          <h1 className={styles.title}>Credentials</h1>
          <button className={styles.close} onClick={toggleOverlay}><MdClose /></button>
        </div>

        <div className={styles.Credentials__content}>
          {coveredCredentials.map((credential) => (
            <div key={credential} className={styles.Credentials__credential}>
              <span>{credential}</span>
              <button onClick={() => removeCredentials(credential)}><MdClose /></button>
            </div>
          ))}

          <div className={styles.Credentials__credential}>
            <input
            // className={`${!hasFormat ? styles.invalid : ''}`}
              type="text"
              placeholder="XXX-XXX-XXX"
              value={newCredential}
              onChange={(e) => setNewCredential(e.target.value)}
            />
            <button onClick={handleAddCredential}><MdAdd /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
