import React, { useState, useEffect } from 'react';
import styles from './Filter.module.scss';
import Tag from './Tag';
import { Filter as FilterType } from '@/types';

import { MdSearch } from 'react-icons/md';
import { IoMdPricetag } from "react-icons/io";
import { FaHashtag } from "react-icons/fa";
import { IoTimeSharp } from "react-icons/io5";
import { BiSolidNetworkChart } from "react-icons/bi";


interface FilterProps {
  currentVisibleTags: string[];
  filter: FilterType;
  onFilterClick: (filter: FilterType) => void;
  setFilterName: (name: string) => void;
}

const Filter: React.FC<FilterProps> = ({ filter, onFilterClick, setFilterName, currentVisibleTags }) => {
  const [seenTags, setSeenTags] = useState<string[]>([]);
  const [costs, setCosts] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [connections, setconnections] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const costsRegex = /(€|umsonst)/gm;
    const timeRegex = /(doors|close|day|morgen)/gm;
    const locationRegex = /(\[\[.*?\]\]|.*?\|\[\[.*?\]\])/gm;

    const categorizedTags = seenTags.reduce((acc: any, tag: any) => {
      let hasCostRegex = costsRegex.test(tag) || tag.includes('€');
      let hasTimeRegex = timeRegex.test(tag);
      let hasLocationRegex = locationRegex.test(tag) || (tag.includes('[[') && tag.includes(']]'));

      if (hasCostRegex) {
        !acc.costs.includes(tag) && acc.costs.push(tag);
      } else if (hasTimeRegex) {
        !acc.time.includes(tag) && acc.time.push(tag);
      } else if (hasLocationRegex) {
        !acc.connections.includes(tag) && acc.connections.push(tag.replace(/\[\[|\]\]/gm, ''));
      } else {
        !acc.tags.includes(tag) && acc.tags.push(tag);
      }
      return acc;
    }, { costs: [], time: [], connections: [], tags: [] });

    setCosts(categorizedTags.costs);
    setTime(categorizedTags.time);
    setconnections(categorizedTags.connections);
    setTags(categorizedTags.tags);
  }, [seenTags]);

  const handleTagClick = (tag: string) => {
    let filter: FilterType = {
      tags: [tag],
      connections: [],
      date: null,
      name: '',
      category: ''

    };
    onFilterClick(filter);
  };

  return (
    <div className={styles.filter}>
      <div className={styles.filterSearchContainer}>
        <p className={styles.filterTitle}><MdSearch /></p>
        <input className={styles.filterSearch} type="text" placeholder="" autoFocus
          onChange={(e) => setFilterName(e.target.value)}
          value={filter.name}
        />
      </div>
      <div className={styles.filtersContainer}>
        {costs.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoMdPricetag /></p>
          {costs.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags.includes(tag)} />
          ))}
        </div>}
        {time.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><IoTimeSharp /></p>
          {time.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags.includes(tag)} />
          ))}
        </div>}
        {tags.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><FaHashtag /></p>
          {tags.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags.includes(tag)} />
          ))}
        </div>}
        {connections.length > 0 && <div className={styles.filterContainer}>
          <p className={styles.filterTitle}><BiSolidNetworkChart /></p>
          {connections.map((tag: string, index: number) => (
            <Tag key={`${tag}-${index}`} tag={tag} onClick={handleTagClick} selected={filter.tags.includes(tag)} />
          ))}
        </div>}
      </div>
    </div>
  );
};

export default Filter;
