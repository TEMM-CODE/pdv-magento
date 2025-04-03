export type Theme = "light" | "dark";
export type PrimaryColor = "blue" | "orange";

export const themes = {
  light: {
    button: {
      blue: "bg-blue-500 hover:bg-blue-600",
      orange: "bg-orange-500 hover:bg-orange-600",
    },
  },
  dark: {
    button: {
      blue: "bg-blue-700 hover:bg-blue-800",
      orange: "bg-orange-700 hover:bg-orange-800",
    },
  },
};
