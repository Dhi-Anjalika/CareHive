import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import RootStack from './src/navigation/RootStack';
import { UserProvider } from './src/contexts/UserContext';  
export default function App() {
  return (
    <UserProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer theme={DefaultTheme}>
        <RootStack />
      </NavigationContainer>
    </UserProvider>
  );
}
