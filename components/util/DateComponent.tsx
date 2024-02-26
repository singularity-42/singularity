// DateComponent.tsx
import React, { useEffect, useState } from "react";
import styles from "./DateComponent.module.scss"; // Adjust the path based on your project structure

interface DateComponentProps {
  date: string; // Assuming the date is a string in the format "YYYY\\MM\\DD\\title.md"
}

const DateComponent: React.FC<DateComponentProps> = ({ date }) => {
  // Assuming date is in the format "YYYY\\MM\\DD\\title.md"
  // Format date to "DD.MM.YYYY"
  // 


  // if(date.includes("/"))
  // const possibleFormattedDate = date.split("\\").slice(0, 3).join(".");


  let formattedDate = date;
  if (date.includes("/")) {
    formattedDate = date.split("/").slice(0, 3).join(".");
  }else{
    // than date is now
    let now = new Date();
    formattedDate = `${now.getFullYear()}.${now.getMonth()+1}-${now.getDate()}`;
  }

  const currentDate = new Date(formattedDate);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based
  const dayOfWeek = getDayOfWeek(currentDate);
  const formattedDateOutput = getFormattedDate(dayOfWeek, day, month);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`${styles.dateContainer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.dayOfWeek}>{dayOfWeek}</div>
      <div className={styles.formattedDate}>
        <div className={styles.day}>{day}.</div>
        <div className={styles.month}>{month}.</div>
        <div className={styles.year}>{currentDate.getFullYear()}</div>
      </div>
      <div className={styles.styledHamburger}>
      <Until date={`${currentDate.getFullYear()}-${month}-${day}`} />
        {/* <Hambuger disabled={true} /> */}
      </div>
    </div>
  );
};

// Function to get the day of the week in German
const getDayOfWeek = (date: Date): string => {
  const daysOfWeek = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  return daysOfWeek[date.getDay()];
};

// Function to get the formatted date
const getFormattedDate = (dayOfWeek: string, day: number, month: number): string => {
  return `${dayOfWeek}, ${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}`;
};

export default DateComponent;


interface DaysUntilProps {
  date: string;
}

const Until: React.FC<DaysUntilProps> = ({ date = "2021-01-01" }) => {
  const today = new Date();
  const dateParts = date.split("-");
  const dateObject = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
  const timeDiff = dateObject.getTime() - today.getTime();
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (diffDays == 0) return <div className={styles.daysUntil}>Heute</div>;
  if (diffDays == 1) return <div className={styles.daysUntil}>Morgen</div>;
  if (diffDays == 2) return <div className={styles.daysUntil}>Übermorgen</div>;
  if (diffDays < 0) return <div className={styles.daysUntil}>Vor {diffDays * -1} Tagen</div>;
  return <div className={styles.daysUntil}>In {diffDays} Tagen</div>;
};