// Entity.tsx
import React, { useEffect } from "react";
import styles from "./Entity.module.scss";
import Markdown from "../content/Markdown";
import Tags from "./Tags";
import HoverLink from "../content/HoverLink";
import { useDetails } from "@/hooks/provider/DetailsProvider";
import Gallery from "../content/Gallery";

interface EntityProps {
  entity: any;
  onTagClick?: (tag: string) => void;
  selected?: string[];
}
const Entity: React.FC<EntityProps> = ({ entity, onTagClick, selected }) => {
  const { setName, toggleVisibility, visible } = useDetails();

  if (!entity) {
    return <div>Loading...</div>;
  }
  const [isHovered, setIsHovered] = React.useState(false); // State to track hover

  const { title, tags } = entity.metadata;
  const handleClick = () => {
    toggleVisibility();
    setName(title);
  };

  const content = entity.content;
  return (
    <div
      className={styles.entityContainer}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)} // Set isHovered to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set isHovered to false on mouse leave
    >
      <div className={styles.socialMediaContainer}>
        <h2 className={styles.title}>
          {(() => {
            // title is sometimes a date so we want to display it with . and reorder to day.month.year
            if (title.includes("-")) {
              const date = title.split("-");
              let year = date[2].split(/\\|\//);
              year = year[year.length - 1];
              let month = date[1].split(/\\|\//);
              month = month[month.length - 1];
              let day = date[0].split(/\\|\//);
              day = day[day.length - 1];

              // get wochentag Mo, Di, Mi, Do, Fr, Sa, So
              const weekday = new Date(+year, +month - 1, +day).getDay();
              const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
              day = `${weekdays[weekday]} ${day}`;


              return (
                <div className={styles.dateContainer}>
                  <p className={styles.date}>{`${day}.${month}.${year}`}</p>
                  <DaysUntil date={`${title}`} />
                </div>
              );
              // return `${date[2]}.${date[1]}.${date[0]}`;
            }

            let path = title.split(/\\|\//);
            let name = path[path.length - 1];
            return <p className={styles.date}>{name}</p>;
          })()}
        </h2>
        <Tags tags={tags} onTagClick={onTagClick} selected={selected} />
      </div>

      {entity.metadata.original && (
        <div className={styles.original}>
          ORIGINAL:{" "}
          <HoverLink name={entity.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}>
            {" "}
            {entity.metadata.original.replaceAll("[", "").replaceAll("]", "").replaceAll('"', "")}{" "}
          </HoverLink>
        </div>
      )}

      {/* <div className={styles.filterTagsContainer}>
                <SocialMedias metadata={entity.metadata} />
            </div>
            <div className={styles.detailsContainer}>
                <div className={styles.galleryContainer}>
                    <Gallery images={entity.images} name={title} />
                </div>
            </div>
            <div className={styles.contentContainer}>
                {content.length > 4.2 && ( // @TODO: fix this and find a better way to check if there is content
                    <Markdown content={content} active={isHovered} /> 
                )}
            </div> 
            */}
    </div>
  );
};

interface DaysUntilProps {
  date: string;
}

const DaysUntil: React.FC<DaysUntilProps> = ({ date = "2021-01-01" }) => {
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

export default Entity;
