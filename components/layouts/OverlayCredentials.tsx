"use client";

import React, { useCallback, useEffect, useState } from 'react';
import styles from './OverlayCredentials.module.scss';
import { MdAdd, MdClose, MdLock } from 'react-icons/md';
import { useCredentials } from '@/hooks/provider/useCredentials';

// Credentials component
const CredentialsOverlay: React.FC = () => {
  const { toggleOverlay, visible, credentials, addCredentials, removeCredentials } = useCredentials();
  const [newCredential, setNewCredential] = useState('');

  const handleAddCredential = useCallback(() => {
    addCredentials(newCredential);
    setNewCredential('');
  }, [newCredential]);

  return (<>
    <div className={styles.credentialsButtonContainer}>

    </div>
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`}>
      <div className={styles.Credentials}>
        <div className={styles.header}>
          <h1 className={styles.title}>Credentials</h1>
          <button className={styles.close} onClick={toggleOverlay}><MdClose /></button>
        </div>

        <div className={styles.Credentials__content}>
          {credentials.map((credential) => (
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
  </>
  );
};

export default CredentialsOverlay;

export const Lock = () => {
  const { toggleOverlay } = useCredentials();

  return (
    <button className={styles.credentialsButton} onClick={toggleOverlay}>
      <MdLock />
    </button>
  );
};
