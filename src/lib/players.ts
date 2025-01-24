// Possible player names
export const PLAYER_NAMES = ["Red", "Green", "Blue", "White"];

// Look-up table for rendering player colors
export const PLAYER_COLORS: { [key: string]: { textColor: string, bgColor: string }} = {
  "Red": { textColor: "text-red-700", bgColor: "bg-red-600"},
  "Green": { textColor: "text-lime-600", bgColor: "bg-lime-400"},
  "Blue": { textColor: "text-cyan-800", bgColor: "bg-cyan-600"}, // Currently broken for buttons? Not sure why https://github.com/tailwindlabs/tailwindcss/discussions/7745
  "White": { textColor: "text-stone-700", bgColor: "bg-stone-100"},
};