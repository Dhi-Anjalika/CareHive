import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import AddMedicine from '../screens/AddMedicine';
import MedicineSummary from '../screens/MedicineSummary';
import ReportScreen from '../screens/ReportScreen'; // <-- import your new screen

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2298d8',
        tabBarInactiveTintColor: '#555',
        tabBarStyle: { padding: 10, height: 70 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="AddMedicine"
        component={AddMedicine}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="MedicineSummary"
        component={MedicineSummary}
        options={{
          tabBarLabel: 'Summary',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assessment" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="report" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
