import React, { useState, useEffect } from 'react';
import styles from './EntityFilter.module.scss';
import { FileContent, Filter } from '@/app/types';
import { FaSearch } from 'react-icons/fa';
import { useVisual } from '@/hooks/provider/useVisual';
import Icon from '../base/Icon';
import ListTags from '../collections/ListTags';
import { FILTER_ICONS, FILTER_REGEX, VIEW_ICONS } from '@/app/defaults';

interface FilterProps {
  files: FileContent[];
  filter: Filter;
  setFilterName: (name: string) => void;
  setFilterDate: (date: Date) => void;
  setFilterTag: (tag: string) => void;
  setFilterConnection: (connection: string) => void;
}

const extractPossibleFiltersFromFiles = (files: FileContent[]): string[] =>{
  const tags = files.reduce((acc: string[], file: FileContent) => {
    const tags = file.metadata.tags as string[];
    if (tags) {
      acc.push(...tags);
    }
    return acc;
  }, []);

  const connections = files.reduce((acc: string[], file: FileContent) => {
    const connections = file.metadata.connections;
    if (connections) {
      if (Array.isArray(connections)) {
        acc.push(...connections);
      } else {
        acc.push(connections);
      }
    }
    return acc;
  }, []);

  const possibleFilters = [...tags, ...connections];

  return possibleFilters
}

const applyTagRegex = (tag: string, regex: RegExp): boolean => regex.test(tag);

const extractFilteredTags = (tags: string[], filter: Filter) =>
  tags.reduce(
    (acc: any, tag: any) => {
      if (!tag) return acc;

      tag = tag.toLowerCase();
      const hasCostRegex = applyTagRegex(tag, FILTER_REGEX.cost);
      const hasTimeRegex = applyTagRegex(tag, /(doors|close|day|morgen)/gm);
      const hasConnectionRegex =
        applyTagRegex(tag, /(\[\[.*?\]\]|.*?\|\[\[.*?\]\])/gm) ||
        (tag.includes('[[') && tag.includes(']]'));

      // // check if tag is in in acc
      // if (acc.costs.has(tag)) acc.costs.delete(tag);
      // if (acc.time.has(tag)) acc.time.delete(tag);
      // if (acc.connections.has(tag)) acc.connections.delete(tag);
      // if (acc.concepts.has(tag)) acc.concepts.delete(tag);

      if (hasCostRegex) acc.costs.add(tag);
      else if (hasTimeRegex) acc.time.add(tag);
      else if (hasConnectionRegex) acc.connections.add(tag.replace(/\[\[|\]\]/gm, '').replace(/"/gm, ''));
      else acc.concepts.add(tag);
      return acc;
    },
    { costs: new Set(), time: new Set(), connections: new Set(), concepts: new Set() }
  );

const EntityFilter: React.FC<FilterProps> = ({ files, filter, setFilterName, setFilterDate, setFilterTag, setFilterConnection }) => {
  const [costs, setCosts] = useState<string[]>([]);
  const [time, setTime] = useState<string[]>([]);
  const [connections, setConnections] = useState<string[]>([]);
  const [tags, setConcepts] = useState<string[]>([]);
  const [filterSwapPossible, setFilterSwapPossible] = useState(false);
  const [filterSwapValue, setFilterSwapValue] = useState('');
  const { cycleViewMode, mode } = useVisual();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFilterName(newName);

    const regexPatterns = [FILTER_REGEX.date, FILTER_REGEX.tag, FILTER_REGEX.cost, FILTER_REGEX.time, FILTER_REGEX.connection];

    for (const pattern of regexPatterns) {
      const match = newName.match(pattern);
      if (match) {
        setFilterSwapPossible(true);
        setFilterSwapValue(match[0]);
        return;
      }
    }

    if (currentVisibleTags.includes(newName)) {
      setFilterSwapPossible(true);
      setFilterSwapValue(newName);
    } else {
      setFilterSwapPossible(false);
      setFilterSwapValue('');
    }
  };

  const handleNameEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filterSwapPossible) {
      handleSwap();
    }
  };

  const handleSwap = () => {
    const currentName = filter.name || '';
    const newName = currentName.replace(filterSwapValue, '');
    setFilterName(newName);
    setFilterSwapValue('');
    setFilterSwapPossible(false);

    switch (true) {
      case filterSwapValue.match(FILTER_REGEX.date) !== null:
        setFilterDate(new Date(filterSwapValue));
        break;
      case filterSwapValue.match(FILTER_REGEX.tag) !== null:
        setFilterTag(filterSwapValue.replace(/\#/gm, ''));
        break;
      case filterSwapValue.match(FILTER_REGEX.cost) !== null:
      case filterSwapValue.match(FILTER_REGEX.time) !== null:
        setFilterTag(filterSwapValue);
        break;
      case filterSwapValue.match(FILTER_REGEX.connection) !== null:
        setFilterConnection(filterSwapValue.replace(/\[\[|\]\]/gm, '').replace(/\"/gm, ''));
        break;
      default:
        if (currentVisibleTags.includes(filterSwapValue)) {
          setFilterTag(filterSwapValue);
        }
        break;
    }
  };

  const [currentVisibleTags, setCurrentVisibleTags] = useState<string[]>([]);

  useEffect(() => {
    setCurrentVisibleTags(extractPossibleFiltersFromFiles(files));
  }, [files]);

  useEffect(() => {
    const categorizedTags = extractFilteredTags(currentVisibleTags, filter);

    if (filter.tags) {
      filter.tags.forEach((tag) => {
        if (tag.match(FILTER_REGEX.date)) categorizedTags.time.add(tag);
        else if (tag.match(FILTER_REGEX.tag)) categorizedTags.concepts.add(tag);
        else if (tag.match(FILTER_REGEX.cost)) categorizedTags.costs.add(tag);
        else if (tag.match(FILTER_REGEX.time)) categorizedTags.time.add(tag);
        else if (tag.match(FILTER_REGEX.connection)) categorizedTags.connections.add(tag.replace(/"/gm, ''));
        else categorizedTags.concepts.add(tag);
      });
    }

    if (filter.date) {
      categorizedTags.time.add(
        filter.date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    }

    if (filter.connections) {
      filter.connections.forEach((connection) => {
        if (categorizedTags.connections.has(connection)) categorizedTags.connections.delete(connection);
        categorizedTags.connections.add(connection.replace(/"/gm, ''));
      });
    }

    // make uniq
    setCosts(Array.from(new Set(categorizedTags.costs)));
    setTime(Array.from(new Set(categorizedTags.time)));
    setConnections(Array.from(new Set(categorizedTags.connections)));
    setConcepts(Array.from(new Set(categorizedTags.concepts)));
  }, [currentVisibleTags]);

  const handleTagClick = (tag: string) => {
    setFilterTag(tag);
  };

  const handleConnectionClick = (connection: string) => {
    setFilterConnection(connection);
  };

  const renderFilterContainer = (
    tags: string[],
    icon: React.ReactNode,
    onClick: (tag: string) => void,
    selected?: string[],
    highlight: string = ''
  ) =>
    tags.length > 0 && (
      <div className={styles.filterContainer}>
        <Icon noBorder={true}>{icon}</Icon>
        <ListTags tags={tags} onTagClick={onClick} selected={selected} highlight={highlight} />
      </div>
    );

  return (
    <div className={styles.filter}>
      <div className={styles.filterSearchContainer}>
        <Icon onClick={handleSwap}>
          <FaSearch />
        </Icon>
        <input
          className={`${styles.filterSearch} ${filterSwapPossible ? styles.filterSwapPossible : ''}`}
          type="text"
          placeholder=""
          autoFocus
          onChange={handleNameChange}
          onKeyDown={handleNameEnter}
          value={filter.name || ''}
        />
        <Icon onClick={cycleViewMode} spinOnClick={true}>
          {VIEW_ICONS[mode]}
        </Icon>
      </div>
      <div className={styles.filtersContainer}>
        {renderFilterContainer(costs, FILTER_ICONS.costs, handleTagClick, filter.tags, filterSwapValue)}
        {renderFilterContainer(time, FILTER_ICONS.time, handleTagClick, filter.tags, filterSwapValue)}
        {renderFilterContainer(tags, FILTER_ICONS.concepts, handleTagClick, filter.tags, filterSwapValue)}
        {renderFilterContainer(connections, FILTER_ICONS.connections, handleConnectionClick, filter.connections, filterSwapValue)}
      </div>
    </div>
  );
};

export default EntityFilter;