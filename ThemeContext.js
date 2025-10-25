import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

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

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

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

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
