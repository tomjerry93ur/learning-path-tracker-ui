import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { PathResponse } from "../types/paths";

type PathsContextValue = {
  paths: PathResponse[];
  setPaths: React.Dispatch<React.SetStateAction<PathResponse[]>>;
  resetPaths: () => void;
};

const PathsContext = createContext<PathsContextValue | undefined>(undefined);

export function PathsProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<PathResponse[]>([]);
  const resetPaths = useCallback(() => setPaths([]), []);

  return <PathsContext.Provider value={{ paths, setPaths, resetPaths }}>{children}</PathsContext.Provider>;
}

export function usePaths() {
  const context = useContext(PathsContext);
  if (!context) {
    throw new Error("usePaths must be used within PathsProvider");
  }
  return context;
}
