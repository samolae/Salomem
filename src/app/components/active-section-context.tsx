import { createContext, useContext, useState, useCallback } from 'react';

type ActiveSectionContextType = {
  activeSection: string;
  setActiveSection: (s: string) => void;
  mobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
};

const ActiveSectionContext = createContext<ActiveSectionContextType>({
  activeSection: 'home',
  setActiveSection: () => {},
  mobileDrawerOpen: false,
  setMobileDrawerOpen: () => {},
});

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSectionState] = useState('home');
  const [mobileDrawerOpen, setMobileDrawerOpenState] = useState(false);
  const setActiveSection = useCallback((s: string) => setActiveSectionState(s), []);
  const setMobileDrawerOpen = useCallback((open: boolean) => setMobileDrawerOpenState(open), []);
  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection, mobileDrawerOpen, setMobileDrawerOpen }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export const useActiveSection = () => useContext(ActiveSectionContext);
