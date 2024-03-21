import React, { useState, useEffect, useMemo } from 'react';
import styles from './EntityCardCalendar.module.scss'; // Import SCSS styles
import DateComponent from '../base/Calendar';
import EntityCardGrid from './EntityCardsColumn'; // Assuming you've implemented this component
import useEntities from '@/hooks/useEntities';

interface CalendarProps {
}

const EntityCardCalendar: React.FC<CalendarProps> = () => {
  const { files } = useEntities();
  const [datedFiles, setDatedFiles] = useState<{ [date: string]: any[] }>({});

  useEffect(() => {
    if (!files) return;

    // Group files by date
    const updatedDatedFiles: { [date: string]: any[] } = {};
    files.forEach((file) => {
      let date = file.date?.split(/-/gm).reverse().join(".");
      if (!date) {
        date = "Unknown";
      }
      
      // Create new date group if it doesn't exist yet
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
      {sortedDates.map((date, index) => (
        <div key={date} className={styles.calendarItem}>
          <div className={styles.dateInfo}>
            <DateComponent date={date} />
          </div>
          <div className={styles.cardsContainer}>
            <EntityCardGrid files={datedFiles[date]} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntityCardCalendar;
