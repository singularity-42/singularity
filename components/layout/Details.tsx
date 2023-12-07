"use client";

import React, { useEffect, useState } from "react";
import styles from "./Details.module.scss";
import Markdown from "../content/Markdown";
import Tags from "./Tags";
import Map from "../content/embed/Map";
import useEntity from "@/hooks/useEntity";
import ListSocials from "./ListSocials";
import Graph from "../content/Graph";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useRelation from "@/hooks/useRelations";
import { MdClose } from "react-icons/md";
import SpotifyTrack from "../content/embed/SpotifyTrack";
import Gallery from "../content/Gallery";
import SoundcloudTrack from "../content/embed/SoundcloudTrack";
import InstagramPost from "../content/embed/InstagramPost";

interface EntityProps {}

const Details: React.FC<EntityProps> = ({}) => {
  const { name, setName, visible, toggleVisibility } = useDetails();

  const { relations } = useRelation(name);
  const { entity, loading, error } = useEntity(name);
  useEffect(() => {
    if (name) {
      if (!visible) toggleVisibility();
    }
  }, [name]);

  useEffect(() => {
    const hash = window.location.hash;
    let decodedUrlHash = decodeURIComponent(hash).replace("#", "");
    setName(decodedUrlHash);
  }, []);

  useEffect(() => {
    if (name) {
      const encodedUrlHash = encodeURIComponent(name);
      window.location.hash = encodedUrlHash;
    }
  }, [name]);

  const handleExit = () => {
    if (visible) toggleVisibility();
  };

  if (!visible) return null;
  if (loading) return null;

  const { metadata } = entity as any;

  return (
    <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
      <button className={styles.closeButton} onClick={handleExit}>
        {/** react icons x or close icons */}
        <MdClose />
      </button>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.detailsContainer}>
            <h2 className={styles.title}>{entity.title.split(/\\|\//).pop()}</h2>
            <h4 className={styles.subtitle}>{entity.folder || ''}</h4>
          </div>
          <div className={styles.tagsContainer}>
            <Tags tags={entity.tags} viewOnly={true} />
          </div>
          <div className={styles.socialMediaContainer}>
            <ListSocials metadata={entity} />
          </div>
          {metadata && metadata.instagram && <Gallery name={metadata.instagram} />}
          {entity.description && entity.description.length > 4.2 && <Markdown content={entity.description} active={true} />}
          {/* {entity.address && <div className={styles.addressContainer}>{entity.address}</div>} */}
        </div>
        <div className={styles.rightContainer}>
          {relations && relations.edges.length > 1 ? <Graph graphData={relations} /> : null}
        </div>
      </div>
      {entity.location && (
        <div className={styles.mapContainer}>
          <Map location={entity.location} />
        </div>
      )}
      <div className={styles.embedContainer}>
        {entity && (entity as any).spotifytrack && <SpotifyTrack track={(entity as any).spotifytrack } />}
        {entity && (entity as any).soundcloudtrack && <SoundcloudTrack track={(entity as any).soundcloudtrack} />}
        {entity && (entity as any).instagrampost && <InstagramPost post={(entity as any).instagrampost} />}
      </div>
    </div>
  );
};

export default Details;
