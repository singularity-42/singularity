"use client"
import React, { useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import styles from './UserInfo.module.scss';
import Button, { ButtonType } from '@/components/util/Button';

enum SessionState {
  LoggedIn,
  LoggedOut,
}

const UserInfo: React.FC<{ menuOpen: boolean }> = ({ menuOpen }) => {
  const { data: session } = useSession();
  const [currentSessionState, setCurrentSessionState] = React.useState<SessionState>(SessionState.LoggedOut);

  useEffect(() => {
    if (session?.user) {
      setCurrentSessionState(SessionState.LoggedIn);
    } else {
      setCurrentSessionState(SessionState.LoggedOut);
    }
  }, [session]);

  const handleLogout = () => {
    signOut();
  };

  const handleLogin = () => {
    signIn();
  };

  return (
    <div className={styles.flex}>

      {
        session?.user &&
        <span className={styles.spanned}>Welcome back {session?.user?.name}!</span>
      }
      <Button
        states={[
          {
            type: ButtonType.Round,
            icon_url: '/icons/user/login.svg',
            icon_alt: SessionState.LoggedOut.toString(),
            onClick: handleLogin,
          },
          {
            type: ButtonType.Round,
            icon_url: '/icons/user/logout.svg',
            icon_alt: SessionState.LoggedIn.toString(),
            onClick: handleLogout,
          }
        ]}
        forcedState={currentSessionState != SessionState.LoggedIn ? SessionState.LoggedOut.toString() : SessionState.LoggedIn.toString()}
      />
    </div>
  );
};

export default UserInfo;
