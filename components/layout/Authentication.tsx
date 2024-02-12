import { useAuth } from '@/hooks/useAuth';
import React, { useCallback, useMemo, useState } from 'react';
import styles from './Authentication.module.scss';
import { MdClose, MdGroups, MdLogin, MdPerson } from 'react-icons/md';
import { FaGhost } from 'react-icons/fa';
import useEntities from '@/hooks/useEntities';
import Loading from '../base/Loading';

// Authentication component
const Authentication: React.FC = () => {
  const { toggleOverlay , visible } = useAuth();
  const [loginType, setLoginType] = useState<string>('anonymous');

  const handleLoginTypeChange = (type: string) => {
    setLoginType(type);
  };

  const handleLogin = () => {
    toggleOverlay();
  };

  const isAnonymous = useCallback(() => {
    return loginType == "anonymous";
  }, [loginType]);

  return (
    <div className={`${styles.overlay} ${visible ? styles.visible : ''}`}>
      <div className={styles.authentication}>
        <button onClick={toggleOverlay}><MdClose /></button>
      </div>
    </div>
  );
};

export default Authentication;
