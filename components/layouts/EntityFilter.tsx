// import React, { useState, useEffect } from 'react';
// import styles from './EntityFilter.module.scss';
// import { FileContent, Filter, FilterType, FilterValue } from '@/app/types';
// import { FaSearch } from 'react-icons/fa';
// import { useVisual } from '@/hooks/provider/useVisual';
// import Icon from '../base/Icon';
// import ListTags from '../collections/ListTags';
// import { FILTER_ICONS, FILTER_REGEX, VIEW_ICONS } from '@/app/defaults';

// interface FilterProps {
//   files: FileContent[];
//   filter: Filter;
//   setFilter: (filter: Filter) => void;
// }

// const extractPossibleFiltersFromFiles = (files: FileContent[]): FilterValue[] => {
//   const allFilters: FilterValue[] = [];

//   files.forEach((file) => {
//     const tags = file.metadata.tags as string[];
//     const connections = file.metadata.connections;
//     if (tags) {
//       tags.forEach((tag) => allFilters.push({ value: tag, type: FilterType.Tag }));
//     }
//     if (connections) {
//       if (Array.isArray(connections)) {
//         connections.forEach((connection) => allFilters.push({ value: connection, type: FilterType.Connection }));
//       } else {
//         allFilters.push({ value: connections as string, type: FilterType.Connection });
//       }
//     }
//   });

//   return allFilters;
// };

// const applyFilterRegex = (value: string, regex: RegExp): boolean => regex.test(value.toLowerCase());

// const EntityFilter: React.FC<FilterProps> = ({ files, filter, setFilter }) => {
//   const [allFilters, setAllFilters] = useState<FilterValue[]>([]);
//   const [filteredFilters, setFilteredFilters] = useState<FilterValue[]>([]);
//   const [filterSwapPossible, setFilterSwapPossible] = useState(false);
//   const [filterSwapValue, setFilterSwapValue] = useState('');

//   useEffect(() => {
//     const extractedFilters = extractPossibleFiltersFromFiles(files);
//     setAllFilters(extractedFilters);
//     setFilteredFilters(extractedFilters);
//   }, [files]);

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newName = e.target.value;
//     const regexPatterns = [FILTER_REGEX.date, FILTER_REGEX.tag, FILTER_REGEX.cost, FILTER_REGEX.time, FILTER_REGEX.connection];

//     for (const pattern of regexPatterns) {
//       const match = newName.match(pattern);
//       if (match) {
//         setFilterSwapPossible(true);
//         setFilterSwapValue(match[0]);
//         return;
//       }
//     }

//     const newFilteredFilters = allFilters.filter((filter) => applyFilterRegex(filter.value, new RegExp(newName, 'i')));
//     setFilteredFilters(newFilteredFilters);

//     if (newFilteredFilters.some((f) => f.value === newName)) {
//       setFilterSwapPossible(true);
//       setFilterSwapValue(newName);
//     } else {
//       setFilterSwapPossible(false);
//       setFilterSwapValue('');
//     }
//   };

//   const handleNameEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter' && filterSwapPossible) {
//       handleSwap();
//     }
//   };

//   const handleSwap = () => {
//     const currentName = filter.name || '';
//     const newName = currentName.replace(filterSwapValue, '');
//     setFilter({ ...filter, name: newName });
//     setFilterSwapValue('');
//     setFilterSwapPossible(false);

//     switch (true) {
//       case filterSwapValue.match(FILTER_REGEX.date) !== null:
//         setFilter({ ...filter, date: new Date(filterSwapValue) });
//         break;
//       case filterSwapValue.match(FILTER_REGEX.tag) !== null:
//       case filterSwapValue.match(FILTER_REGEX.cost) !== null:
//       case filterSwapValue.match(FILTER_REGEX.time) !== null:
//         setFilter({ ...filter, tags: [...filter.tags || [], filterSwapValue] });
//         break;
//       case filterSwapValue.match(FILTER_REGEX.connection) !== null:
//         setFilter({ ...filter, connections: [...filter.connections || [], filterSwapValue] });
//         break;
//       default:
//         if (allFilters.some((f) => f.value === filterSwapValue)) {
//           setFilter({ ...filter, tags: [...filter.tags || [], filterSwapValue] });
//         }
//         break;
//     }
//   };

//   const { cycleViewMode, mode } = useVisual();

//   return (
//     <div className={styles.filter}>
//       <div className={styles.filterSearchContainer}>
//         <Icon onClick={handleSwap}>
//           <FaSearch />
//         </Icon>
//         <input
//           className={`${styles.filterSearch} ${filterSwapPossible ? styles.filterSwapPossible : ''}`}
//           type="text"
//           placeholder=""
//           autoFocus
//           onChange={handleNameChange}
//           onKeyDown={handleNameEnter}
//           value={filter.name || ''}
//         />
//         <Icon onClick={cycleViewMode} spinOnClick={true}>
//           {VIEW_ICONS[mode]}
//         </Icon>
//       </div>
//       <div className={styles.filtersContainer}>
//         {/* {filteredFilters.map((filteredFilter, index) => (
//           <div key={index} className={styles.filterContainer}>
//             <Icon noBorder={true}>{FILTER_ICONS[filteredFilter.type]}</Icon>
//             <ListTags
//               highlight={''}
//               tags={[filteredFilter.value]}
//               onTagClick={(tag) => {
//                 if (filteredFilter.type === FilterType.Tag) {
//                   setFilter({ ...filter, tags: [...filter.tags || [], tag] });
//                 } else if (filteredFilter.type === FilterType.Connection) {
//                   setFilter({ ...filter, connections: [...filter.connections || [], tag] });
//                 }
//               }}
//             />
//           </div>
//         ))} */}
//       </div>
//     </div>
//   );
// };

// export default EntityFilter;

import React, { useState, useEffect } from 'react';
import styles from './EntityFilter.module.scss';
import { FileContent, Filter, FilterType, FilterValue } from '@/app/types';
import { FaSearch } from 'react-icons/fa';
import { useVisual } from '@/hooks/useVisual';
import Icon from '../base/Icon';
import ListTags from '../collections/ListTags';
import { FILTER_ICONS, FILTER_REGEX, VIEW_ICONS } from '@/app/defaults';
import { useFilter } from '@/hooks/useFilter';

interface EntityFilterProps {
}

import { useSearchParams } from 'next/navigation';

export function useTags() {
  const searchParams = useSearchParams();
  const tags = searchParams.get('tags');

  // If you need to split the tags into an array, you can do so here
  const tagsArray = tags ? tags.split(',') : [];

  return tagsArray;
}


const EntityFilter: React.FC<EntityFilterProps> = () => {
  const [search, setSearch] = useState('');
  const { cycleViewMode, mode } = useVisual();
  const { filter } = useFilter();

  const handleSwap = () => {
    console.log('swap');
  };


  return (
    <div className={styles.filter}>
      <div className={styles.filterSearchContainer}>
        <Icon onClick={handleSwap}>
          <FaSearch />
        </Icon>
        <input className={styles.filterSearch} type="text" placeholder="" autoFocus value={search} onChange={(e) => setSearch(e.target.value)} />
        <Icon onClick={cycleViewMode} spinOnClick={true}>
          {VIEW_ICONS[mode]}
        </Icon>
      </div>
      <div className={styles.filtersContainer}>
      </div>
    </div>
  );
}

export default EntityFilter;