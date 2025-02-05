import type React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTheme } from "./theme-provider";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon
        icon={
          theme === "light"
            ? "mdi:weather-night"
            : theme === "dark"
            ? "mdi:weather-sunny"
            : "mdi:desktop-classic"
        }
        className="w-6 h-6 text-gray-800 dark:text-gray-200"
      />
    </motion.button>
  );
};

export default ThemeToggle;
