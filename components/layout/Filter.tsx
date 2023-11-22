import React, { useState, useEffect, useMemo } from 'react';
import styles from './Filter.module.scss';

interface FilterProps {
    filter: string[]; // Available filters
    currentVisibleTags: string[]; // Tags currently visible
    onChange: (filter: string[]) => void; // Callback when filters change
}

const Filter: React.FC<FilterProps> = ({ filter, currentVisibleTags, onChange }) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [seenTags, setSeenTags] = useState<string[]>([]);

    useEffect(() => {
        const combinedTags = Array.from(new Set([...currentVisibleTags, ...seenTags]));
        // sort tags alphabetically
        setSeenTags(combinedTags);
        
        // Synchronize selected filters with visible tags
        const updatedFilters = selectedFilters.filter(filter => combinedTags.includes(filter));
        setSelectedFilters(updatedFilters);
        
        // Trigger the onChange callback with updated filters
        onChange(updatedFilters);
    }, [currentVisibleTags]);

    useEffect(() => {
        setSelectedFilters(filter);
    }, [filter]);

    const handleTagClick = (tag: string) => {
        const updatedFilters = [...selectedFilters];
        const index = updatedFilters.indexOf(tag);

        if (index === -1) {
            updatedFilters.push(tag);
        } else {
            updatedFilters.splice(index, 1);
        }

        setSelectedFilters(updatedFilters);
        onChange(updatedFilters);

        // Update seen tags if necessary
        if (!seenTags.includes(tag)) {
            setSeenTags([...seenTags, tag]);
        }
    };

    return (
        <div className={styles.filter}>
            <div className={styles.filterContainer}>
                {(seenTags || []).sort((a, b) => a.localeCompare(b)).map(tag => (
                    <div
                        key={tag}
                        className={`${styles.tag} ${selectedFilters.includes(tag) ? styles.selected : ''}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;
