"use client";

import React, { useEffect, useState, useCallback } from "react";
import styles from "./OverlayEntity.module.scss";
import EntityContent from "./EntityContent";
import EntityConnections from "./EntityConnections";
import { useEntityOverlay } from "@/hooks/useEntityOverlay";
import useConnection from "@/hooks/useConnection";
import { MdChangeCircle, MdChangeHistory, MdClose, MdEdit, MdHistoryEdu, MdLink, MdSave, MdShare, MdUndo, MdVerified } from "react-icons/md";
import { FileContent, Filter } from "@/app/types";
import ListSocials from "../collections/ListSocials";
import ListTags from "../collections/ListTags";
import useEntity from "@/hooks/useEntity";
import Icon from "../base/Icon";
import Link from "../base/Link";
import { metadata } from "@/app/layout";

interface DetailsProps { }
{/* <MdConnectWithoutContact /> */ }
const EntityOverlay: React.FC<DetailsProps> = () => {
  const { name, date, setName, visible, toggleVisibility, editing, setEditing } = useEntityOverlay();
  const { connection } = useConnection({
    name: name,
    date: date,
    category: undefined,
    tags: undefined,
    connections: undefined
  } as unknown as Filter);
  const { file, loading, error, update, save } = useEntity({
    name: name,
    date: date,
    category: undefined,
    tags: undefined,
    connections: undefined
  } as unknown as Filter);
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

  useEffect(() => {
    if (name) {
      const encodedUrlHash = encodeURIComponent(name);
      window.location.hash = encodedUrlHash;
    }
  }, [name]);

  const [changedDate, setChangedDate] = useState("");

  useEffect(() => {
    if (file) {
      let unixtimecodeString = file.metadata.timestamp as string;
      let unixtimecode = parseInt(unixtimecodeString);
      let date = new Date();
      date.setTime(unixtimecode);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let milliseconds = date.getMilliseconds();
      let dateString = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
      setChangedDate(dateString);
    }
  }, [file]);



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
            <ListSocials metadata={file?.metadata} editing={editing} onChange={handleSocialsChange} />
          </div>
          <div className={styles.tagsContainer}>
            <ListTags tags={file?.metadata.tags as string[]} editing={editing} onChange={handleTagsChange} highlight={""} />
          </div>
          <div className={styles.markdownContentContainer}>
            <EntityContent content={file?.markdown || ''} active editing={editing} onChange={handleMarkdownChange} />
            <div className={styles.metadataChangeInformation}>
              <div className={styles.metadataContainer}>
                <Icon noBorder={true} >
                  <MdHistoryEdu />
                </Icon>
                <div className={styles.createdDate}>
                  {file?.metadata.changed &&
                    <Link name={(file?.metadata.changed as string).replace(/\[|\]|\"/gm, "")}>
                      {(file?.metadata.changed as string).replace(/\[|\]|\"/gm, "")}
                    </Link>}
                </div>
                <div className={styles.changedDate}>
                  {changedDate}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.graphContainer}>
          {<EntityConnections connections={connection} />}
        </div>
      </div>
    </div>
  );
};

export default EntityOverlay;
