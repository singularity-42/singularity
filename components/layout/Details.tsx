// pages/entity/[name].tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './Entity.module.scss';
import Markdown from '../content/Markdown';
import Tags from './Tags';
import Map from '../content/Map';
import SocialList from './SocialList';
import Graph from '../content/Graph';
import useEntity from '@/hooks/useEntity';
import { Entity } from '@/types';



const Details: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [entity, setEntity] = useState<Entity>(
    {
      title: '',
      tags: [],
      description: '',
    }
  );

  const handleExit = () => {
    setVisible(false);
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    let name = decodeURIComponent(window.location.hash).replace('#', '');
    setName(name);
    let entity = useEntity(name);
    setEntity(entity);

  }, [window.location.hash]);

  if (!entity) {
    return <div>Loading... {name}</div>;
  }

  return (
    <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
      <Head>
        <title>{entity.title}</title>
      </Head>
      <button className={styles.closeButton} onClick={handleExit}>X</button>
      <div className={styles.detailsContainer}>
        <h2 className={styles.title}>{entity.title}</h2>
      </div>
      <div className={styles.tagsContainer}>
        <Tags tags={entity.tags} />
      </div>
      <div className={styles.socialMediaContainer}>
        <SocialList metadata={entity} />
      </div>
      {entity.address && <div className={styles.addressContainer}>{entity.address}</div>}
      {entity.location && <Map location={entity.location} />}
      {entity.description && <Markdown content={entity.description} active={true} />}
    </div>
  );
};

export default Details;
