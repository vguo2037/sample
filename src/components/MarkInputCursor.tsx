import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SettingsContext } from "../utils";
import { ImCross } from "react-icons/im";
import { RiRadioButtonFill } from "react-icons/ri";

const MarkInputCursor = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const { playerPlayAs } = useContext(SettingsContext);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (<>
    <motion.div
      animate={{ x: mousePosition.x, y: mousePosition.y }}
      transition={{ type: "spring" }}
    >
      { playerPlayAs === "X" ? <ImCross size={24} /> : <RiRadioButtonFill size={24} /> }
    </motion.div>
  </>);
};

export default MarkInputCursor;
