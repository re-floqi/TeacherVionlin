import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
  ThemeContext
  - Παρέχει θεματικό αντικείμενο (χρώματα, mode) και helpers για toggle.
  - Χρησιμοποιείται από τα components μέσω του hook useTheme().
*/
const ThemeContext = createContext();

/*
  useTheme hook
  - Εύκολος τρόπος για components να καταναλώσουν το context.
  - Σημαντικό: throw αν το hook καλείται εκτός Provider για να αποφευχθούν σιωπηλά σφάλματα.
*/
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/*
  lightTheme / darkTheme
  - Ορίζουν τα χρώματα και βασικά tokens για UI.
  - Τα components χρησιμοποιούν αυτά τα πεδία για styling αντί για "μαγικούς" χρωματικούς κώδικες.
*/
const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#5e72e4',
    background: '#f5f5f5',
    card: '#fff',
    text: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    border: '#e0e0e0',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    headerBackground: '#5e72e4',
    headerText: '#fff',
    inputBackground: '#fff',
    inputBorder: '#e0e0e0',
    shadow: '#000',
    disabled: '#ccc',
  },
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#6c7fd8',
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    border: '#404040',
    success: '#34ce57',
    warning: '#ffd34e',
    danger: '#ff4757',
    info: '#48dbfb',
    headerBackground: '#2d2d2d',
    headerText: '#e0e0e0',
    inputBackground: '#3a3a3a',
    inputBorder: '#505050',
    shadow: '#000',
    disabled: '#505050',
  },
};

/*
  ThemeProvider component
  - Περιέχει την κατάσταση isDarkMode και την λογική αποθήκευσης / ανάκτησης προτίμησης.
  - Παρέχει: theme (τα χρώματα), isDarkMode (boolean), toggleTheme() και isLoading (κατάσταση ανάκτησης).
*/
export const ThemeProvider = ({ children }) => {
  // isDarkMode: boolean flag που αντιπροσωπεύει την τρέχουσα λειτουργία
  const [isDarkMode, setIsDarkMode] = useState(false);
  // isLoading: true ενώ διαβάζουμε την αποθηκευμένη προτίμηση από AsyncStorage
  const [isLoading, setIsLoading] = useState(true);

  // Κατά το mount φορτώνουμε την αποθηκευμένη προτίμηση
  useEffect(() => {
    loadThemePreference();
  }, []);

  /*
    loadThemePreference
    - Διαβάζει το κλειδί 'theme' από AsyncStorage.
    - Αν υπάρχει, ορίζει το isDarkMode ανάλογα ('dark' -> true).
    - Στο τέλος θέτει isLoading false.
    - Σημείωση: σιωπηρό fallback αν αποτύχει.
  */
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /*
    toggleTheme
    - Εναλλάσσει το isDarkMode και αποθηκεύει την επιλογή στο AsyncStorage.
    - Χρήσιμο για κουμπιά αλλαγής θέματος στην UI.
  */
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Επιλογή του αντικειμένου theme ανάλογα με το isDarkMode
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Το value που θα παρέχεται σε καταναλωτές του context
  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  // Παρέχουμε το context σε όλα τα children
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
