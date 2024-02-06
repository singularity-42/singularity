"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Details.module.scss";
import Markdown from "../../view/Markdown";
import Tags from "../collections/Tags";
import Map from "../../base/Map";
import useEntity from "@/hooks/useEntity";
import Socials from "../collections/Socials";
import Graph from "../../view/Graph";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useRelation from "@/hooks/useRelations";
import { MdClose } from "react-icons/md";
import SpotifyTrack from "../../base/SpotifyTrack";
import Gallery from "../../base/Gallery";
import SoundcloudTrack from "../../base/SoundcloudTrack";
import InstagramPost from "../../base/InstagramPost";

interface EntityProps {}

const Details: React.FC<EntityProps> = () => {
 const { name, setName, visible, toggleVisibility } = useDetails();
 const { relations } = useRelation(name);
 const { entity, loading, error } = useEntity(name);

 const handleExit = useCallback(() => {
    setName("");
    if (visible) toggleVisibility();
 }, [visible, toggleVisibility]);

 useEffect(() => {
    if (name) {
      if (!visible) toggleVisibility();
    }
 }, [name, visible, toggleVisibility]);

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

 if (!visible || loading) return null;

 const { metadata } = entity as any;

 return (
    <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
      <button className={styles.closeButton} onClick={handleExit}>
        <MdClose />
      </button>
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.detailsContainer}>
            <h2 className={styles.title}>{(entity.title || '').split(/\\|\//).pop()}</h2>
            <h4 className={styles.subtitle}>{entity.folder || ''}</h4>
          </div>
          <div className={styles.socialMediaContainer}>
            <Socials metadata={entity} />
          </div>
          <div className={styles.tagsContainer}>
            <Tags tags={entity.tags || []} viewOnly={true} />
          </div>
          {metadata && metadata.instagram && <Gallery name={metadata.instagram} />}
          {entity.description && entity.description.length > 4.2 && <Markdown content={entity.description} active={true} />}
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
