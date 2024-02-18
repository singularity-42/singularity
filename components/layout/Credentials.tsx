"use client";

import { useAuth } from '@/hooks/useAuth';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Credentials.module.scss';
import { MdAdd, MdClose, MdLock } from 'react-icons/md';

// Credentials component
const Credentials: React.FC = () => {
  const { toggleOverlay, visible, credentials, addCredentials, removeCredentials } = useAuth();
  const [newCredential, setNewCredential] = useState('');

  const handleAddCredential = useCallback(() => {
    addCredentials(newCredential);
    setNewCredential('');
  }, [newCredential]);

  let timeoutId: any = null;

  const handleCopyCredential = useCallback((e: React.MouseEvent<HTMLSpanElement>, credential: string) => {
    const target = e.target as HTMLSpanElement; // Cast to the correct type
    if (target && target.textContent) {

      navigator.clipboard.writeText(credential);

      // Change the text for  2 seconds to indicate that the content was copied
      target.textContent = 'Copied!';

      // If a timeout is already set, clear it before setting a new one
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout and save its ID
      timeoutId = setTimeout(() => {
        if (target && target.textContent === 'Copied!') {
          target.textContent = credential; // Reset the text after  2 seconds
        }
      }, 2000);
    }
  }, []);


  return (<>
    <div className={styles.credentialsButtonContainer}>
      <button className={styles.credentialsButton} onClick={toggleOverlay}>
        <MdLock />
      </button>
    </div>
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`}>
      <div className={styles.Credentials}>
        <div className={styles.header}>
          <h1 className={styles.title}>Credentials</h1>
          <button className={styles.close} onClick={toggleOverlay}><MdClose /></button>
        </div>

        <div className={styles.Credentials__content}>
          {credentials.map((credential) => (
            <div
              key={credential}
              className={styles.Credentials__credential}
              // copy content to clipboard on click
              onClick={(e) => handleCopyCredential(e, credential)}
            >
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

export default Credentials;
