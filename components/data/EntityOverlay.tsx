"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./EntityOverlay.module.scss";
import Markdown from "./EntityMarkdown";
import Tags from "./ListTags";
import useFile from "@/hooks/useFile";
import Socials from "./ListSocials";
import EntityConnections from "./EntityConnections";
import { useEntity } from "@/hooks/provider/EntityProvider";
import useConnection from "@/hooks/useConnection";
import { MdClose, MdEdit, MdLink, MdSave, MdShare, MdUndo } from "react-icons/md";
import EmbedTrackSpotify from "../content/EmbedTrackSpotify";
import EmbedTrackSoundcloud from "../content/EmbedTrackSoundcloud";
import { FileContent } from "@/types";

interface DetailsProps { }

const EntityOverlay: React.FC<DetailsProps> = () => {
  const { name, setName, visible, toggleVisibility, editing, setEditing } = useEntity();
  const { connection } = useConnection(name);
  const { file, loading, error, update, save } = useFile(name);
  const [graphVisible, setGraphVisible] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleToggleGraph = () => {
    setGraphVisible(!graphVisible);
  };

  const handleEdit = () => {
    if (editing) {
      // todo should undo last change
      setEditing(false);
      setName(name);
      setHasChanged(false);
      return;
    }
    setEditing(true);
  };

  const handleSave = () => {
    save();
    setEditing(false);
  };

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
    setHasChanged(true);
    update(newFile);
  };

  const handleTagsChange = (tags: string[]) => {
    let newFile = { ...file, metadata: { ...file?.metadata, tags } } as FileContent;
    setHasChanged(true);
    update(newFile);
  };

  const handleMarkdownChange = (markdown: string) => {
    let newFile = { ...file, markdown } as FileContent;
    setHasChanged(true);
    update(newFile);
  };

  const handleSocialsChange = (metadata: any) => {
    let newFile = { ...file, metadata } as FileContent;
    setHasChanged(true);
    update(newFile);
  };

  useEffect(() => {
    if (name) {
      if (!visible) toggleVisibility();
    }
  }, [name, visible]);

  useEffect(() => {
    const hash = window.location.hash;
    let decodedUrlHash = decodeURIComponent(hash).replace("#", "");
    setName(decodedUrlHash);
  }, []);

  // useEffect(() => {
  //   if (loading) return;
  //   if (!file?.name && visible) {
  //     setName("")
  //     toggleVisibility()
  //   }

  // }, [file, visible, loading]);

  useEffect(() => {
    if (name) {
      const encodedUrlHash = encodeURIComponent(name);
      window.location.hash = encodedUrlHash;
    }
  }, [name]);

  return (
    <div className={`${styles.popup} ${visible ? styles.show : styles.hide} ${loading ? styles.loading : ""}`}>
      <button className={styles.closeButtonContainer} onClick={handleExit}>
        <MdClose />
      </button>
      <button className={styles.shareButtonContainer} onClick={handleShare}>
        <MdShare />
      </button>
      <button className={styles.editButtonContainer} onClick={handleEdit}>
        {!editing ? <MdEdit /> : <MdUndo />}
      </button>
      {
        hasChanged && <button className={styles.saveButtonContainer} onClick={handleSave}>
          <MdSave />
        </button>
      }
      <div className={styles.contentContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.detailsContainer}>
            {
              editing ?
                <input className={styles.titleInput} type="text" value={file?.name} onChange={handleTitleChange} />
                : <h2 className={styles.title}>{(file?.name || '').split(/\\|\//).pop()}</h2>
            }
            <h4 className={styles.subtitle}>{file?.category || ''}</h4>
          </div>
          {/* Date */}
          <div className={styles.dateContainer}>
            {file && file?.date && <div>{file.date.replace(/\-/gm, ".")}</div>}
          </div>
          <div className={styles.socialMediaContainer}>
            <Socials metadata={file?.metadata} editing={editing} onChange={handleSocialsChange} />
          </div>
          <div className={styles.tagsContainer}>
            <Tags tags={file?.metadata.tags as string[]} editing={editing} onChange={handleTagsChange} />
          </div>
          {file?.markdown && <Markdown content={file.markdown} active={true} editing={editing} onChange={handleMarkdownChange} />}
          {file && (file as any).spotifytrack && <EmbedTrackSpotify track={(file as any).spotifytrack} />}
          {file && (file as any).soundcloudtrack && <EmbedTrackSoundcloud track={(file as any).soundcloudtrack} />}
        </div>
        <div className={styles.graphContainer}>
          {<EntityConnections connections={connection} />}
        </div>
      </div>
    </div>
  );
};

export default EntityOverlay;
