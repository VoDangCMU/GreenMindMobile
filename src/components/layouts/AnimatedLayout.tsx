import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigationDirection } from "@/store/navigationDirectionStore";

export default function AnimatedLayout() {
  const location = useLocation();
  const { direction, setDirection } = useNavigationDirection();

  // Khi location thay đổi xong => reset lại hướng về 'forward'
  useEffect(() => {
    const timer = setTimeout(() => setDirection("forward"), 400);
    return () => clearTimeout(timer);
  }, [location.pathname, setDirection]);

  const variants = {
    enter: (dir: "forward" | "back") => ({
      x: dir === "forward" ? "100%" : "-100%",
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
    },
    exit: (dir: "forward" | "back") => ({
      x: dir === "forward" ? "-100%" : "100%",
      opacity: 0,
      position: "absolute",
    }),
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={location.pathname}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.45, 0, 0.55, 1] }}
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
