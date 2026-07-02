export type ColorScale = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
};

export interface ThemeColorTokens {
  background: string;
  foreground: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  correct: string;
  warning: string;
  green: string;
  kakao: string;
  toastBgBase: string;
  toastText: string;
  grey: ColorScale;
  purple: ColorScale;
  red: ColorScale;
  lime: ColorScale;
}

export const lightThemeColors: ThemeColorTokens = {
  background: "#ffffff",
  foreground: "#171717",
  primary: "#ff5e3e",
  primaryLight: "#ff8b8b",
  primaryDark: "#ff4c4c",
  secondary: "#fed421",
  correct: "#2172fe",
  warning: "#e14141",
  green: "#31dd65",
  kakao: "#fee500",
  toastBgBase: "#232424",
  toastText: "#f7f7f8",
  grey: {
    100: "#f7f7f8",
    200: "#edeef0",
    300: "#dfe1e4",
    400: "#c6c8cc",
    500: "#a4a6aa",
    600: "#73757a",
    700: "#43454a",
    800: "#232424",
  },
  purple: {
    100: "#f2eeff",
    200: "#cdc5ff",
    300: "#a79dff",
    400: "#877fff",
    500: "#6652e0",
    600: "#4a38b3",
    700: "#232424",
    800: "#232424",
  },
  red: {
    100: "#ffecec",
    200: "#ffcece",
    300: "#ff8b8b",
    400: "#ff6b6b",
    500: "#ff4c4c",
    600: "#df4444",
    700: "#d13f3f",
    800: "#b12f2f",
  },
  lime: {
    100: "#efffc3",
    200: "#e2fe98",
    300: "#d5fd6a",
    400: "#cafa40",
    500: "#c8ff00",
    600: "#bdeb00",
    700: "#aed400",
    800: "#a0bc00",
  },
};

export const darkThemeColors: ThemeColorTokens = {
  background: "#232424",
  foreground: "#f7f7f8",
  primary: lightThemeColors.primary,
  primaryLight: lightThemeColors.primaryDark,
  primaryDark: lightThemeColors.primaryDark,
  secondary: lightThemeColors.secondary,
  correct: lightThemeColors.correct,
  warning: lightThemeColors.warning,
  green: lightThemeColors.green,
  kakao: lightThemeColors.kakao,
  toastBgBase: "#43454a",
  toastText: "#f7f7f8",
  grey: {
    100: "#343536",
    200: "#404142",
    300: "#515253",
    400: "#6a6b6d",
    500: "#8a8b8d",
    600: "#b0b2b3",
    700: "#d2d3d4",
    800: "#f7f7f8",
  },
  purple: {
    100: "#2c2b3a",
    200: "#3b365b",
    300: "#5c50a7",
    400: "#6e5ed3",
    500: "#7866e9",
    600: "#9382ee",
    700: "#b3a7f2",
    800: "#d2caf6",
  },
  red: {
    100: "#622e2e",
    200: "#843636",
    300: "#a04949",
    400: "#b75c5c",
    500: "#d34444",
    600: "#d58585",
    700: "#e89a9a",
    800: "#f0baba",
  },
  lime: {
    100: "#56622e",
    200: "#78833c",
    300: "#8d9644",
    400: "#a2aa4e",
    500: "#d0ea66",
    600: "#d6ee7a",
    700: "#ddf291",
    800: "#e6f6af",
  },
};

export const themeColors = {
  light: lightThemeColors,
  dark: darkThemeColors,
} as const;

export type ThemeName = keyof typeof themeColors;

function buildActiveCssVariables(theme: ThemeColorTokens): Record<string, string> {
  return {
    "--background": theme.background,
    "--foreground": theme.foreground,
    "--color-primary": theme.primary,
    "--color-primary-light": theme.primaryLight,
    "--color-primary-dark": theme.primaryDark,
    "--color-secondary": theme.secondary,
    "--color-correct": theme.correct,
    "--color-warning": theme.warning,
    "--color-green": theme.green,
    "--color-kakao": theme.kakao,
    "--color-grey-100": theme.grey[100],
    "--color-grey-200": theme.grey[200],
    "--color-grey-300": theme.grey[300],
    "--color-grey-400": theme.grey[400],
    "--color-grey-500": theme.grey[500],
    "--color-grey-600": theme.grey[600],
    "--color-grey-700": theme.grey[700],
    "--color-grey-800": theme.grey[800],
    "--color-purple-100": theme.purple[100],
    "--color-purple-200": theme.purple[200],
    "--color-purple-300": theme.purple[300],
    "--color-purple-400": theme.purple[400],
    "--color-purple-500": theme.purple[500],
    "--color-purple-600": theme.purple[600],
    "--color-purple-700": theme.purple[700],
    "--color-purple-800": theme.purple[800],
    "--color-red-100": theme.red[100],
    "--color-red-200": theme.red[200],
    "--color-red-300": theme.red[300],
    "--color-red-400": theme.red[400],
    "--color-red-500": theme.red[500],
    "--color-red-600": theme.red[600],
    "--color-red-700": theme.red[700],
    "--color-red-800": theme.red[800],
    "--color-lime-100": theme.lime[100],
    "--color-lime-200": theme.lime[200],
    "--color-lime-300": theme.lime[300],
    "--color-lime-400": theme.lime[400],
    "--color-lime-500": theme.lime[500],
    "--color-lime-600": theme.lime[600],
    "--color-lime-700": theme.lime[700],
    "--color-lime-800": theme.lime[800],
    "--color-toast-bg-base": theme.toastBgBase,
    "--color-toast-text": theme.toastText,
  };
}

function toCssBlock(
  selector: string,
  variables: Record<string, string>,
  indent = "  "
): string {
  const lines = Object.entries(variables).map(
    ([name, value]) => `${indent}${name}: ${value};`
  );

  return `${selector} {\n${lines.join("\n")}\n}`;
}

export function createWebColorStyleText(): string {
  const lightVariables = buildActiveCssVariables(lightThemeColors);
  const darkVariables = buildActiveCssVariables(darkThemeColors);

  return [
    toCssBlock(":root", lightVariables),
    `@media (prefers-color-scheme: dark) {\n${toCssBlock(":root", darkVariables, "    ")}\n}`,
    toCssBlock(':root[data-theme="light"]', lightVariables),
    toCssBlock(':root[data-theme="dark"]', darkVariables),
  ].join("\n\n");
}

export const nativewindLightColors = {
  background: lightThemeColors.background,
  foreground: lightThemeColors.foreground,
  primary: lightThemeColors.primary,
  "primary-light": lightThemeColors.primaryLight,
  "primary-dark": lightThemeColors.primaryDark,
  secondary: lightThemeColors.secondary,
  correct: lightThemeColors.correct,
  warning: lightThemeColors.warning,
  green: lightThemeColors.green,
  kakao: lightThemeColors.kakao,
  grey: lightThemeColors.grey,
  purple: lightThemeColors.purple,
  red: lightThemeColors.red,
  lime: lightThemeColors.lime,
  toast: {
    DEFAULT: lightThemeColors.toastBgBase,
    foreground: lightThemeColors.toastText,
  },
} as const;
