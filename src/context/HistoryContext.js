import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext(null);
const VERIFICATION_HISTORY_KEY = 'greenbin_verification_history';

export function HistoryProvider({ children }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [isHistoryHydrated, setIsHistoryHydrated] = useState(false);

  useEffect(() => {
    async function restoreHistory() {
      try {
        const storedHistory = await AsyncStorage.getItem(VERIFICATION_HISTORY_KEY);
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
        setHistoryItems(Array.isArray(parsedHistory) ? parsedHistory : []);
      } finally {
        setIsHistoryHydrated(true);
      }
    }

    restoreHistory();
  }, []);

  const value = useMemo(
    () => ({
      historyItems,
      isHistoryHydrated,
      addHistoryItem: async (item) => {
        const nextItem = {
          id: `${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...item,
        };

        const nextHistory = [nextItem, ...historyItems];
        setHistoryItems(nextHistory);
        await AsyncStorage.setItem(VERIFICATION_HISTORY_KEY, JSON.stringify(nextHistory));
      },
    }),
    [historyItems, isHistoryHydrated]
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }

  return context;
}
