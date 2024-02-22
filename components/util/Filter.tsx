import React, { useState, useEffect } from 'react';
import styles from './Filter.module.scss';
import Tag from '../content/Tag';
import { CategoryType, FileContent, Filter as FilterType } from '@/types';

import { MdSearch } from 'react-icons/md';
import { IoMdPricetag } from "react-icons/io";
import { FaHashtag } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { BiSolidNetworkChart } from "react-icons/bi";


interface FilterProps {
  files: FileContent[];
  filter: FilterType;
  setFilterName: (name: string) => void;
  setFilterCategory: (category: CategoryType) => void;
  setFilterDate: (date: Date) => void;
  setFilterTag: (tag: string) => void;
  setFilterConnection: (connection: string) => void;
}

const Filter: React.FC<FilterProps> = ({ files, filter, setFilterName, setFilterCategory, setFilterDate, setFilterTag, setFilterConnection }) => {

  const [costs, setCosts] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [filterSwapPossible, setFilterSwapPossible] = useState(false);
  const [filterSwapValue, setFilterSwapValue] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const newName = e.target.value;
    setFilterName(newName);
    const visibleFilters = [...costs, ...time, ...tags, ...connections];

    const matchingFilter = (visibleFilters || []).find((filterValue) => newName.toLowerCase().includes(filterValue.toLowerCase()));
    if (matchingFilter) {
      let filter = matchingFilter;
      if (typeof filter !== "string")
        filter = matchingFilter[0];
      setFilterSwapPossible(true);
      setFilterSwapValue(filter);
    } else {
      setFilterSwapPossible(false);
      setFilterSwapValue('');
    }
  };

  const handleNameEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filterSwapPossible) {
      // Swap the filter and remove the string part
      const newName = (filter.name || '').replace(filterSwapValue, '');
      setFilterName(newName);

      if (tags.includes(filterSwapValue) || costs.includes(filterSwapValue)) {
        setFilterTag(filterSwapValue);
      }

      if (connections.includes(filterSwapValue)) {
        setFilterConnection(filterSwapValue);
      }

      setFilterSwapPossible(false);
      setFilterSwapValue('');
    }
  };

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
          acc.connections.add(tag.replace(/\[\[|\]\]/gm, '').replace(/\"/gm, ''));
        } else {
          acc.tags.add(tag);
        }
        return acc;
      },
      { costs: new Set(), time: new Set(), connections: new Set(), tags: new Set() }
    );

    // add current filter to categorized tags
    if (filter.tags) {
      filter.tags.forEach((tag: string) => {
        categorizedTags.tags.add(tag);
      });
    }

    if (filter.connections) {
      filter.connections.forEach((tag: string) => {
        categorizedTags.connections.add(tag);
      });
    }

    setCosts(Array.from(new Set(categorizedTags.costs)));
    setTime(Array.from(new Set(categorizedTags.time)));
    setConnections(Array.from(new Set(categorizedTags.connections)));
    setTags(Array.from(new Set(categorizedTags.tags)));
  }, [files]);

  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
  };

  const handleConnectionClick = (connection: string) => {
    setFilterConnection(connection);
  };


  return (
    <div className={styles.filter}>
      <div className={styles.filterSearchContainer}>
        <p className={styles.filterTitle}><MdSearch /></p>
        <input
          className={`${styles.filterSearch} ${filterSwapPossible ? styles.filterSwapPossible : ''}`}
          type="text"
          placeholder=""
          autoFocus
          onChange={handleNameChange}
          onKeyDown={handleNameEnter}
          value={filter.name}
        />
      </div>
      <div className={styles.filtersContainer}>
        {costs.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoMdPricetag /></p>
          {costs.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} highlight={filterSwapValue != '' && tag.includes(filterSwapValue)} />
          ))}
        </div>}
        {time.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoTimeSharp /></p>
          {time.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} highlight={filterSwapValue != '' && tag.includes(filterSwapValue)} />
          ))}
        </div>}
        {tags.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><FaHashtag /></p>
          {tags.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags?.includes(tag)} highlight={filterSwapValue != '' && tag.includes(filterSwapValue)} />
          ))}
        </div>}
        {connections.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><BiSolidNetworkChart /></p>
          {/* {connections.map((tag: string, index: number) => ( remove dublicates */}
          {connections.filter((v, i, a) => a.indexOf(v) === i).map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleConnectionClick} selected={filter.connections?.includes(tag)} highlight={filterSwapValue != '' && tag.includes(filterSwapValue)} />
          ))}
        </div>}
      </div>
    </div>
  );
};

export default Filter;
