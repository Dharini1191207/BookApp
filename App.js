import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import BookList from './BookList';
import BookDetail from './BookDetail';
import BorrowedScreen, { BorrowedBooksProvider } from './Borrowed';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#4CAF50' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="BookList" component={BookList} options={{ title: 'Books List' }} />
      <Stack.Screen name="BookDetail" component={BookDetail} options={{ title: 'Book Detail' }} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Borrowed') {
            iconName = focused ? 'book' : 'book-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Borrowed" component={BorrowedScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <BorrowedBooksProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </BorrowedBooksProvider>
  );
}
