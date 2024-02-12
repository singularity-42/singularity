"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Details.module.scss";
import Markdown from "./Markdown";
import Tags from "./Tags";
import useEntity from "@/hooks/useEntity";
import Socials from "./Socials";
import Graph from "./Graph";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useRelation from "@/hooks/useRelations";
import { MdClose, MdEdit, MdSave, MdShare } from "react-icons/md";
import EmbedTrackSpotify from "../base/EmbedTrackSpotify";
import EmbedTrackSoundcloud from "../base/EmbedTrackSoundcloud";
import EmbedPostInstagram from "../base/EmbedPostInstagram";
import Loading from "../base/Loading";
import { useAuth } from "@/hooks/useAuth";

interface EntityProps { }

const Details: React.FC<EntityProps> = () => {
  const { name, setName, visible, toggleVisibility, goBack, editing, setEditing } = useDetails();
  const { relations } = useRelation(name);
  const { entity, loading, error, update } = useEntity(name);
  const { isAuthenticated, authName, toggleOverlay, overlayVisible } = useAuth();

  const handleEdit = useCallback(() => {
    if (editing) {
      if(isAuthenticated && authName === name)
        setEditing(false);
      else if (!overlayVisible)
        toggleOverlay();

    }
    else setEditing(true);
  }, [editing]);

  const handleExit = useCallback(() => {
    setName("");
    setEditing(false);
    if (visible) toggleVisibility();
  }, [visible, toggleVisibility]);

  const handleBack = useCallback(() => {
    const lastLink = goBack();
    if (lastLink) {
      setName(lastLink);
    }
  }, [goBack, setName]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: entity.title,
        text: entity.description,
        url: window.location.href
      }).then(() => {
        console.log('Thanks for sharing!');
      })
        .catch(console.error);
    }
  }, [entity]);

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
    if (loading) return;
    if (!entity?.title && !entity?.content && visible) {
      setName("")
      toggleVisibility()
    }

  }, [entity, visible, loading]);

  useEffect(() => {
    if (name) {
      const encodedUrlHash = encodeURIComponent(name);
      window.location.hash = encodedUrlHash;
    }
  }, [name]);

  return (
    <div className={`${styles.popup} ${visible ? styles.show : styles.hide}`}>
      <button className={styles.closeButtonContainer} onClick={handleExit}>
        <MdClose />
      </button>
      <button className={styles.shareButtonContainer} onClick={handleShare}>
        <MdShare />
      </button>
      <button className={styles.editButtonContainer} onClick={handleEdit}>
        {editing ? <MdSave /> : <MdEdit />}
      </button>

      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          {!loading ? (<>
            <div className={styles.detailsContainer}>
              {
                editing ? 
                <input className={styles.titleInput} type="text" value={entity.title} onChange={(e) => update({ ...entity, title: e.target.value })} /> 
                : <h2 className={styles.title}>{(entity.title || '').split(/\\|\//).pop()}</h2>
              }
              <h4 className={styles.subtitle}>{entity.folder || ''}</h4>
            </div>
            <div className={styles.socialMediaContainer}>
              <Socials metadata={entity} editing={editing} onChange={(metadata: any) => update({ ...entity, ...metadata })} />
            </div>
            <div className={styles.tagsContainer}>
              <Tags tags={entity.tags || []} viewOnly={true} editing={editing} onChange={(tags: string[]) => update({ ...entity, tags })} />
            </div>
            {entity.description && entity.description.length > 4.2 && <Markdown content={entity.description} active={true} editing={editing} onChange={(content: string) => update({ ...entity, description: content })} />}

            {entity && (entity as any).spotifytrack && <EmbedTrackSpotify track={(entity as any).spotifytrack} />}
            {entity && (entity as any).soundcloudtrack && <EmbedTrackSoundcloud track={(entity as any).soundcloudtrack} />}
            {entity && (entity as any).instagrampost && <EmbedPostInstagram post={(entity as any).instagrampost} />}
          </>) : <Loading />}
        </div>
        {!loading && <div className={styles.graphContainer}>
          {relations && relations.edges.length > 1 ? <Graph graphData={relations} /> : null}
        </div>}
      </div>
    </div>
  );
};

export default Details;
