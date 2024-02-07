"use client";

import Title from '@/components/base/Title';
import HoverLink from '@/components/view/HoverLink';
import Table from '@/components/view/Table';
import { useTooltip } from '@/hooks/provider/TooltipProvider';
import React, { useEffect } from 'react';
import styles from './page.module.scss'; // Import your styles

const ChangePage: React.FC = () => {

  const { setTooltip } = useTooltip();

  useEffect(() => {
    setTooltip('changes - Änderungen mit Geschichte');
  }, [setTooltip]);

  return (
    <div className={styles.infoBlock}>
      {/* In Future is this the place to change information about the <Title /> will be made. */}
      <div className={styles.infoContainer}>
        <span>
          <b className={styles.coloredText}>Du</b> kannst{" "}<Title /> auf <HoverLink href="https://github.com/singularity-42/singularity/tree/docs" name="GitHub" openInNewTab={true} >GitHub</HoverLink> <b><i>verändern</i></b> und bald auch in der App!
        </span>
      </div>
    </div>
  );
};

export default ChangePage;
