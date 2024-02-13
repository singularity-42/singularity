"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./Details.module.scss";
import Markdown from "./Markdown";
import Tags from "./Tags";
import useFile from "@/hooks/useFile";
import Socials from "./Socials";
import Graph from "./Graph";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import useConnection from "@/hooks/useConnection";
import { MdClose, MdEdit, MdSave, MdShare } from "react-icons/md";
import EmbedTrackSpotify from "../base/EmbedTrackSpotify";
import EmbedTrackSoundcloud from "../base/EmbedTrackSoundcloud";
import EmbedPostInstagram from "../base/EmbedPostInstagram";
import Loading from "../base/Loading";
import { useAuth } from "@/hooks/useAuth";
import { FileContent } from "@/types";

interface DetailsProps { }

const Details: React.FC<DetailsProps> = () => {
  const { name, setName, visible, toggleVisibility, editing, setEditing } = useDetails();
  const { connection: relations } = useConnection(name);
  const { file, loading, error, update, save} = useFile(name);

  const handleEdit = useCallback(() => {
    if (editing) {
      save();
      setEditing(false);
    }
    else setEditing(true);
  }, [editing]);

  const handleExit = useCallback(() => {
    setName("");
    setEditing(false);
    if (visible) toggleVisibility();
  }, [visible, toggleVisibility]);

  const handleShare = useCallback(() => {
    if (navigator.share && file) {
      navigator.share({
        title: file.name,
        text: file.markdown,
        url: window.location.href
      }).then(() => {
      })
        .catch(console.error);
    }
  }, [file]);


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // update({ ...file, name: e.target.value });
      let newName = e.target.value;
      let newFile = { ...file, name: newName } as FileContent;
      update(newFile);
    };

    const handleTagsChange = (tags: string[]) => {
      let newFile = { ...file, metadata: { ...file?.metadata, tags } } as FileContent;
      update(newFile);
    };

    const handleMarkdownChange = (markdown: string) => {
      let newFile = { ...file, markdown } as FileContent;
      update(newFile);
    };

    const handleSocialsChange = (metadata: any) => {
      let newFile = { ...file, metadata } as FileContent;
      update(newFile);
    };

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
      if (!file?.name && visible) {
        setName("")
        toggleVisibility()
      }
  
    }, [file, visible, loading]);
  
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
                <input className={styles.titleInput} type="text" value={file?.name} onChange={handleTitleChange} />
                : <h2 className={styles.title}>{(file?.name || '').split(/\\|\//).pop()}</h2>
              }
              <h4 className={styles.subtitle}>{file?.category || ''}</h4>
            </div>
            <div className={styles.socialMediaContainer}>
              <Socials metadata={file?.metadata} editing={editing} onChange={handleSocialsChange} />
            </div>
            <div className={styles.tagsContainer}>
              <Tags tags={(file?.metadata.tags as string[]) || []} editing={editing} onChange={handleTagsChange} />
            </div>
            {file?.markdown && file?.markdown.length > 4.2 && <Markdown content={file.markdown} active={true} editing={editing} onChange={handleMarkdownChange} />}

            {file && (file as any).spotifytrack && <EmbedTrackSpotify track={(file as any).spotifytrack} />}
            {file && (file as any).soundcloudtrack && <EmbedTrackSoundcloud track={(file as any).soundcloudtrack} />}
            {file && (file as any).instagrampost && <EmbedPostInstagram post={(file as any).instagrampost} />}
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
