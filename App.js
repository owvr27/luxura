import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { HistoryProvider } from './src/context/HistoryContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { navigationTheme } from './src/theme/navigationTheme';

export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AuthProvider>
          <HistoryProvider>
            <NavigationContainer ref={navigationRef} theme={navigationTheme}>
              <StatusBar style="dark" />
              <AppNavigator navigationRef={navigationRef} />
            </NavigationContainer>
          </HistoryProvider>
        </AuthProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
