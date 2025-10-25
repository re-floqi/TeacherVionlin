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

// Import auth service
import { getCurrentSession } from './supabaseService';

const Stack = createNativeStackNavigator();

export default function App() {
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5e72e4" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#5e72e4',
            },
            headerTintColor: '#fff',
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
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
