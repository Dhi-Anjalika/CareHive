import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import MainTabs from './MainTabs';
import ProfileScreen from '../screens/ProfileScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="MainTabs" component={MainTabs} />
  <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  <Stack.Screen name='AppointmentsScreen' component={AppointmentsScreen} />
  <Stack.Screen name="AddAppointmentScreen" component={AddAppointmentScreen} />
  <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
</Stack.Navigator>
  );
}
