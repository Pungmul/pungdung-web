export const bindViewportChange = (onChange: () => void): (() => void) => {
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  mediaQuery.addEventListener("change", onChange);

  return () => {
    mediaQuery.removeEventListener("change", onChange);
  };
};
