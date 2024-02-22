import React, { useState, useEffect, useMemo } from 'react';
import styles from './EntityCardCalendar.module.scss'; // Import SCSS styles
import DateComponent from '../util/DateComponent';
import EntityCardGrid from './EntityCardGrid'; // Assuming you've implemented this component

interface CalendarProps {
  files: any[];
  onTagClick: (tag: string) => void;
}

const EntityCardCalendar: React.FC<CalendarProps> = ({ files, onTagClick }) => {
  const [datedFiles, setDatedFiles] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    if (!files) return;

    // Group files by date
    const updatedDatedFiles: { [date: string]: any[] } = {};
    files.forEach((file) => {
      const date = file.date.split(/-/gm).reverse().join("."); // Format date as needed
      updatedDatedFiles[date] = updatedDatedFiles[date] || [];
      updatedDatedFiles[date].push(file);
    });

    // Sort files alphabetically within each date group
    Object.keys(updatedDatedFiles).forEach((date) => {
      updatedDatedFiles[date].sort((a, b) => a.name.localeCompare(b.name));
    });

    setDatedFiles(updatedDatedFiles);
  }, [files]);

  const sortByDate = (a: string, b: string) => (new Date(a) as Date).getTime() - new Date(b).getTime();

  const sortedDates = useMemo(() => Object.keys(datedFiles).sort(sortByDate), [datedFiles]);

  return (
    <div className={styles.calendar}>
      {sortedDates.length > 0 ? (
        sortedDates.map((date, index) => (
          <div key={date} className={styles.calendarItem}>
            <div className={styles.dateInfo}>
              <DateComponent date={date} />
            </div>
            <div className={styles.cardsContainer}>
              <EntityCardGrid files={datedFiles[date]} onTagClick={onTagClick} />
            </div>
          </div>
        ))
      ) : (
        <p>No files to display.</p>
      )}
    </div>
  );
};

export default EntityCardCalendar;
