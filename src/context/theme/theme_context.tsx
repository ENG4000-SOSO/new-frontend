import { ThemeContextType } from "@context/theme/theme_types";
import { createContext, useContext } from "react";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
