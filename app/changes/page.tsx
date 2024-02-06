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
    setTooltip('changes - Änderungen, an Singularity, können auf GitHub vorgenommen werden.');
  }, [setTooltip]);

  return (
    <div className={styles.infoBlock}>
      {/* In Future is this the place to change information about the <Title /> will be made. */}
      <div className={styles.infoContainer}>
        <span>
          <b className={styles.coloredText}>Du</b> kannst{" "}
          <Title />&nbsp;verändern, indem du die&nbsp;
          <HoverLink href="https://github.com/singularity-42/singularity/tree/docs/docs" name="Dokumentation" openInNewTab={true} >
            Dokumentation
          </HoverLink>
          &nbsp;
          auf GitHub bearbeitest.
        </span>
      </div>
    </div>
  );
};

export default ChangePage;
