"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type GlobalContextType = {
  unreadMessages: number;
  setUnreadMessages: React.Dispatch<React.SetStateAction<number>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  return (
    <GlobalContext.Provider value={{ unreadMessages, setUnreadMessages }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within GlobalContextProvider",
    );
  }
  return context;
}
