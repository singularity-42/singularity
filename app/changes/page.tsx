"use client";

import Title from '@/components/base/Title';
import Link from '@/components/base/Link';
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
          <b className={styles.coloredText}>Du</b> kannst{" "}<Title /> auf <Link href="https://github.com/singularity-42/singularity/tree/main/docs" name="GitHub" openInNewTab={true} >GitHub</Link> <b><i>verändern</i></b> und bald auch in der App!
        </span>
      </div>
    </div>
  );
};

export default ChangePage;
