const initTheme = () => {
    console.log("hi");
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const changeTheme = (checked, setLightTheme) => {
    if (checked) {
      localStorage.theme = "light";
      setLightTheme(true);
    } else {
      localStorage.theme = "dark";
      setLightTheme(false);
    }
  };
  
  const getTheme = () => localStorage.getItem("theme");
  
  export { initTheme, changeTheme, getTheme };