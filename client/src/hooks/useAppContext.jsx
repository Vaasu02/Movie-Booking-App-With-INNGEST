import { useContext } from "react";
import { AppContext } from "../context/AppContextDefinition";

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);