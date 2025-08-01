import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import existing screens
import TripTimelineScreen from './src/screens/TripTimelineScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import ExpenseGroupScreen from './src/screens/ExpenseGroupScreen';
import AddExpenseModal from './src/components/AddExpenseModal';
import AddPersonModal from './src/components/AddPersonModal';
import AddGroupModal from './src/components/AddGroupModal';
import AddTicketModal from './src/components/AddTicketModal';
import FileViewer from './src/components/FileViewer';

// Import new UX screens
import NewTripTimelineScreen from './src/screens/NewTripTimelineScreen';
import NewExpensesScreen from './src/screens/NewExpensesScreen';
import NewBookingsScreen from './src/screens/NewBookingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Timeline Stack
function TimelineStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TripTimeline" component={NewTripTimelineScreen} />
    </Stack.Navigator>
  );
}

// Expenses Stack
function ExpensesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExpensesMain" component={NewExpensesScreen} />
    </Stack.Navigator>
  );
}

// Bookings Stack
function BookingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingsMain" component={NewBookingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                if (route.name === 'Timeline') {
                  iconName = focused ? 'calendar' : 'calendar-outline';
                } else if (route.name === 'Expenses') {
                  iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'Bookings') {
                  iconName = focused ? 'ticket' : 'ticket-outline';
                } else {
                  iconName = 'ellipse';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#6366f1',
              tabBarInactiveTintColor: '#6b7280',
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
              },
              headerShown: false,
            })}
          >
            <Tab.Screen
              name="Timeline"
              component={TimelineStack}
              options={{ title: 'Timeline' }}
            />
            <Tab.Screen
              name="Expenses"
              component={ExpensesStack}
              options={{ title: 'Expenses' }}
            />
            <Tab.Screen
              name="Bookings"
              component={BookingsStack}
              options={{ title: 'Bookings' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
