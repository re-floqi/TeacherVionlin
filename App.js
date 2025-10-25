import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import StudentsScreen from './screens/StudentsScreen';
import AddEditStudentScreen from './screens/AddEditStudentScreen';
import AddEditLessonScreen from './screens/AddEditLessonScreen';
import RecurringLessonsScreen from './screens/RecurringLessonsScreen';
import PaymentStatsScreen from './screens/PaymentStatsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Import auth service
import { getCurrentSession } from './supabaseService';

// Import theme
import { ThemeProvider, useTheme } from './ThemeContext';

const Stack = createNativeStackNavigator();

function AppContent() {
  const { theme, isLoading: themeLoading } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const session = await getCurrentSession();
    setIsAuthenticated(!!session);
    setIsLoading(false);
  };

  if (isLoading || themeLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'auto'} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.headerBackground,
            },
            headerTintColor: theme.colors.headerText,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen 
              name="Login" 
              options={{ headerShown: false }}
            >
              {props => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen 
                name="Home" 
                options={{ title: 'Ημερολόγιο Μαθημάτων' }}
              >
                {props => <HomeScreen {...props} onLogout={() => setIsAuthenticated(false)} />}
              </Stack.Screen>
              <Stack.Screen 
                name="Students" 
                component={StudentsScreen}
                options={{ title: 'Μαθητές' }}
              />
              <Stack.Screen 
                name="AddEditStudent" 
                component={AddEditStudentScreen}
                options={({ route }) => ({ 
                  title: route.params?.student ? 'Επεξεργασία Μαθητή' : 'Νέος Μαθητής' 
                })}
              />
              <Stack.Screen 
                name="AddEditLesson" 
                component={AddEditLessonScreen}
                options={({ route }) => ({ 
                  title: route.params?.lesson ? 'Επεξεργασία Μαθήματος' : 'Νέο Μάθημα' 
                })}
              />
              <Stack.Screen 
                name="RecurringLessons" 
                component={RecurringLessonsScreen}
                options={{ title: 'Επαναλαμβανόμενα Μαθήματα' }}
              />
              <Stack.Screen 
                name="PaymentStats" 
                component={PaymentStatsScreen}
                options={{ title: 'Στατιστικά Πληρωμών' }}
              />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{ title: 'Ρυθμίσεις' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
