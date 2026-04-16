import { createContext, useContext, useState, useCallback } from 'react';

type ActiveSectionContextType = {
  activeSection: string;
  setActiveSection: (s: string) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: 'home',
  setActiveSection: () => {},
});

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState('home');
  const setActiveSection = useCallback((s: string) => setActiveSectionState(s), []);
  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export const useActiveSection = () => useContext(ActiveSectionContext);
