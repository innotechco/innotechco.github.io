import {useEffect, useState} from "react";

import {ThemeContext} from "./theme-context.js";

export function ThemeProvider({children}) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  /* The theme was React state and nothing else, which meant a stylesheet could
     not see it. The scrollbar has to: it is painted by the browser, outside the
     page's own markup, so no component can hand it a colour.

     One attribute on <html> is enough, and it is the ordinary way of doing
     this - anything else that has to follow the theme from CSS can read the
     same attribute rather than growing another mechanism. */
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
