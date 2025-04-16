import { ThemeContext } from "@context/theme/theme_context";
import { ReactNode, useState } from "react";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme && savedTheme == "dark" ? savedTheme : "light";
  });

  const switchTheme = () => {
    setTheme(oldTheme => {
      const newTheme = oldTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
