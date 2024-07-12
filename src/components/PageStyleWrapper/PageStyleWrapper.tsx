// style (animation) wrapper for individual pages

import React from "react";
import { motion } from "framer-motion"; 

interface PageStyleWrapperProps {
  children: React.ReactNode
}

const PageStyleWrapper: React.FC<PageStyleWrapperProps> = ({ children }) => {
  return <>
    <motion.div
      className="center-children page-content"
      initial={{ opacity: 0, x: "12.5vw" }}
      animate={{ opacity: 1, x: "0vw" }}
      transition={{ type: "spring", bounce: 0.5 }}
    >
      {children}
    </motion.div>
  </>;
};

export default PageStyleWrapper;
