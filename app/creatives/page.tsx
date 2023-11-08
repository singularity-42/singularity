// pages/creatives.tsx

import { motion } from 'framer-motion';
import CreativesList from '@/components/util/CreativesList';

const variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const CreativesPage: React.FC = () => {
  return (
    <div>
      <motion.div initial="initial" animate="animate" exit="exit" variants={variants}>
        <CreativesList />
      </motion.div>
    </div>
  );
};

export default CreativesPage;