import React, { useState, useEffect } from 'react';
import styles from './Filter.module.scss';
import Tag from '../content/Tag';
import { FileContent, Filter as FilterType } from '@/types';

import { MdSearch } from 'react-icons/md';
import { IoMdPricetag } from "react-icons/io";
import { FaHashtag } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { BiSolidNetworkChart } from "react-icons/bi";


interface FilterProps {
  files: FileContent[];
  filter: FilterType;
  setFilterName: (name: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterDate: (date: Date) => void;
  setFilterTag: (tag: string) => void;
  setFilterConnections: (connections: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ files, filter, setFilterName, setFilterCategory, setFilterDate, setFilterTag, setFilterConnections }) => {
 
  const [costs, setCosts] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const currentVisibleTags = files
      .map((file) => file.metadata.tags)
      .flat()
      .concat(files.map((file) => file.metadata.connections).flat());
  
    const costsRegex = /(€|umsonst)/gm;
    const timeRegex = /(doors|close|day|morgen)/gm;
    const locationRegex = /(\[\[.*?\]\]|.*?\|\[\[.*?\]\])/gm;
  
    const categorizedTags = currentVisibleTags.reduce(
      (acc: any, tag: any) => {
        if (!tag) return acc;
  
        tag = tag.toLowerCase();
        let hasCostRegex = costsRegex.test(tag) || tag.includes('€');
        let hasTimeRegex = timeRegex.test(tag);
        let hasConnectionRegex = locationRegex.test(tag) || (tag.includes('[[') && tag.includes(']]'));
  
        if (hasCostRegex) {
          acc.costs.add(tag);
        } else if (hasTimeRegex) {
          acc.time.add(tag);
        } else if (hasConnectionRegex) {
          acc.connections.add(tag.replace(/\[\[|\]\]/gm, ''));
        } else {
          acc.tags.add(tag);
        }
        return acc;
      },
      { costs: new Set(), time: new Set(), connections: new Set(), tags: new Set() }
    );
  
    setCosts(Array.from(categorizedTags.costs));
    setTime(Array.from(categorizedTags.time));
    setConnections(Array.from(categorizedTags.connections));
    setTags(Array.from(categorizedTags.tags));
  }, [files]);

  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
  };

  const handleConnectionClick = (location: string) => {
    const connections = filter.connections?.includes(location) ? filter.connections?.filter(l => l !== location) : [...(filter.connections || []), location];
    setFilterConnections(connections);
  };


  return (
    <div className={styles.filter}>
      <div className={styles.filterSearchContainer}>
        <p className={styles.filterTitle}><MdSearch /></p>
        <input className={styles.filterSearch} type="text" placeholder="" autoFocus
          onChange={(e) => {
            setFilterName(e.target.value)}
          }
          value={filter.name}
        />
      </div>
      <div className={styles.filtersContainer}>
        {costs.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoMdPricetag /></p>
          {costs.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} />
          ))}
        </div>}
        {time.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoTimeSharp /></p>
          {time.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} />
          ))}
        </div>}
        {tags.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><FaHashtag /></p>
          {tags.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} />
          ))}
        </div>}
        {connections.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><BiSolidNetworkChart /></p>
          {connections.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleConnectionClick} selected={filter.connections?.includes(tag)} />
          ))}
        </div>}
      </div>
    </div>
  );
};

export default Filter;
