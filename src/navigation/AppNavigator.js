import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import LanguageToggleButton from '../components/LanguageToggleButton';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PinLockScreen from '../screens/PinLockScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import { theme } from '../theme';
import MainDrawerNavigator from './MainDrawerNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ navigationRef }) {
  const { isHydrated, isLoggedIn, isPinRequired } = useAuth();
  const { isRTL, t } = useLanguage();

  useEffect(() => {
    if (!navigationRef?.isReady()) {
      return;
    }

    const currentRouteName = navigationRef.getCurrentRoute()?.name;

    if (isLoggedIn && isPinRequired && currentRouteName !== 'PinLock') {
      navigationRef.navigate('PinLock');
      return;
    }

    if (!isLoggedIn && (currentRouteName === 'MainApp' || currentRouteName === 'PinLock')) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isLoggedIn, isPinRequired, navigationRef]);

  if (!isHydrated) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: theme.colors.background,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={theme.colors.primaryStrong} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? (isPinRequired ? 'PinLock' : 'MainApp') : 'Splash'}
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerRight: () => <LanguageToggleButton />,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerShown: false,
        headerTintColor: theme.colors.primaryStrong,
        headerTitleAlign: isRTL ? 'right' : 'left',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: true,
          title: t('navigation.login'),
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: true,
          title: t('navigation.register'),
        }}
      />
      <Stack.Screen name="MainApp" component={MainDrawerNavigator} />
      <Stack.Screen name="PinLock" component={PinLockScreen} />
    </Stack.Navigator>
  );
}
