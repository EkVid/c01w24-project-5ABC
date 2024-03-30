"use client";
const { createContext } = require("react");

// Used to store current color blindness mode for child components to use
const ColourBlindnessContext = createContext();
export default ColourBlindnessContext;
